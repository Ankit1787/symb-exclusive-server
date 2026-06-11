import { ProductDocument } from "../../models/product.model.js";
import {
  getAllProducts,
  getProductByCategory,
  searchProducts,
} from "../../repositories/product.repository.js";

export interface SearchProductsToolArgs {
  query: string;
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  keywords?: string[];
  limit?: number;
}

export interface SearchProductsToolResult {
  products: ProductDocument[];
  filtersUsed: {
    query: string;
    category?: string;
    maxPrice?: number;
    minPrice?: number;
    keywords: string[];
    limit: number;
  };
}

export const searchProductsToolDefinition = {
  type: "function",
  function: {
    name: "search_products",
    description:
      "Search the product database for real products matching shopping intent, budget, category, and tags.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Natural language search phrase, product type, category, brand, or tag.",
        },
        category: {
          type: "string",
          description: "Optional product category to constrain the search.",
        },
        maxPrice: {
          type: "number",
          description: "Optional maximum product price.",
        },
        minPrice: {
          type: "number",
          description: "Optional minimum product price.",
        },
        keywords: {
          type: "array",
          items: { type: "string" },
          description:
            "Optional product keywords, tags, attributes, or use cases.",
        },
        limit: {
          type: "number",
          description: "Maximum number of matching products to return, capped at 10.",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
} as const;

const normalize = (value: string) => value.trim().toLowerCase();

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "best",
  "below",
  "for",
  "in",
  "less",
  "me",
  "need",
  "of",
  "or",
  "over",
  "show",
  "suggest",
  "than",
  "the",
  "to",
  "under",
  "with",
]);

const extractPriceFilters = (query: string) => {
  const term = normalize(query).replace(/[₹,]/g, "");
  const betweenMatch = term.match(/between\s+(\d+)\s+(?:and|to|-)\s+(\d+)/);
  const maxMatch = term.match(
    /(?:under|below|less than|up to|upto|within)\s+(\d+)/,
  );
  const minMatch = term.match(/(?:above|over|more than|from)\s+(\d+)/);

  if (betweenMatch) {
    return {
      minPrice: Number(betweenMatch[1]),
      maxPrice: Number(betweenMatch[2]),
    };
  }

  return {
    minPrice: minMatch ? Number(minMatch[1]) : undefined,
    maxPrice: maxMatch ? Number(maxMatch[1]) : undefined,
  };
};

const extractKeywords = (query: string) =>
  normalize(query)
    .replace(/[₹,]/g, "")
    .replace(/between\s+\d+\s+(?:and|to|-)\s+\d+/g, "")
    .replace(/(?:under|below|less than|up to|upto|within)\s+\d+/g, "")
    .replace(/(?:above|over|more than|from)\s+\d+/g, "")
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z0-9-]/g, ""))
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

const getSearchableText = (product: ProductDocument) =>
  [
    product.title,
    product.category,
    product.brand,
    product.description,
    ...(product.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const matchesKeywords = (product: ProductDocument, keywords: string[]) => {
  if (!keywords.length) return true;

  const searchable = getSearchableText(product);

  return keywords.some((keyword) => searchable.includes(keyword));
};

const filterProducts = (
  products: ProductDocument[],
  args: SearchProductsToolArgs,
) => {
  const extractedPriceFilters = extractPriceFilters(args.query);
  const minPrice = args.minPrice ?? extractedPriceFilters.minPrice;
  const maxPrice = args.maxPrice ?? extractedPriceFilters.maxPrice;
  const keywords = [
    ...extractKeywords(args.query),
    ...(args.keywords ?? []).map(normalize),
  ].filter(Boolean);
  const category = args.category ? normalize(args.category) : "";

  return products.filter((product) => {
    const productPrice = Number(product.price);
    const productCategory = normalize(product.category ?? "");

    if (Number.isFinite(maxPrice) && productPrice > Number(maxPrice)) {
      return false;
    }

    if (Number.isFinite(minPrice) && productPrice < Number(minPrice)) {
      return false;
    }

    if (category && !productCategory.includes(category)) {
      return false;
    }

    return matchesKeywords(product, keywords);
  });
};

export const executeSearchProductsTool = async (
  args: SearchProductsToolArgs,
): Promise<SearchProductsToolResult> => {
  const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 10);
  const query = args.query?.trim() || "";
  const extractedPriceFilters = extractPriceFilters(query);
  const minPrice = args.minPrice ?? extractedPriceFilters.minPrice;
  const maxPrice = args.maxPrice ?? extractedPriceFilters.maxPrice;
  const keywords = [
    ...extractKeywords(query),
    ...(args.keywords ?? []).map(normalize),
  ].filter(Boolean);

  let candidates: ProductDocument[] = [];

  if (args.category) {
    candidates = await getProductByCategory(args.category);
  } else if (query) {
    candidates = await searchProducts(query);
    if (!candidates.length) {
      candidates = await getAllProducts();
    }
  } else {
    candidates = await getAllProducts();
  }

  const products = filterProducts(candidates, args).slice(0, limit);

  return {
    products,
    filtersUsed: {
      query,
      category: args.category,
      maxPrice,
      minPrice,
      keywords,
      limit,
    },
  };
};
