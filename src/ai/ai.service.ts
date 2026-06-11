import { ProductDocument } from "../models/product.model.js";
import { getProductById } from "../repositories/product.repository.js";
import { shoppingAssistantPrompt } from "./prompts/shoppingAssistant.prompt.js";
import {
  executeSearchProductsTool,
  searchProductsToolDefinition,
  SearchProductsToolArgs,
  SearchProductsToolResult,
} from "./tools/searchProducts.tool.js";
import { GoogleGenAI } from "@google/genai";

interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
}

interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

interface OpenAiChatChoice {
  message: ChatMessage;
}

interface OpenAiChatResponse {
  choices: OpenAiChatChoice[];
}

export interface ShoppingAssistantRequest {
  message: string;
  context?: {
    currentProductId?: string;
    cartProductIds?: string[];
    wishlistProductIds?: string[];
    category?: string;
    budget?: number;
  };
}

export interface ShoppingRecommendation {
  product: ProductDocument;
  reason: string;
  uri:string;
}

export interface ShoppingAssistantResponse {
  message: string;
  recommendations: ShoppingRecommendation[];
  filtersUsed: SearchProductsToolResult["filtersUsed"] | Record<string, never>;
  toolCalls: Array<{
    name: string;
    arguments: SearchProductsToolArgs;
  }>;
}

interface AssistantJsonResponse {
  message?: string;
  recommendations?: Array<{
    productId?: string;
    reason?: string;
  }>;
  filtersUsed?: SearchProductsToolResult["filtersUsed"];
}

const OPENAI_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-2.5-flash";
const getOpenAiHeaders = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Exclusive Shopping Assistant",
  };
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
const callGemini = async (
  messages: ChatMessage[],
  includeTools = true,
) => {
  const lastMessage =
    messages[messages.length - 1]?.content ?? "";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: lastMessage,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  return response.text;
};
const callOpenAi = async (messages: ChatMessage[], includeTools = true) => {
  // const response = await fetch(OPENAI_API_URL, {
  //   method: "POST",
  //   headers: getOpenAiHeaders(),
  //   body: JSON.stringify({
  //     model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
  //     messages,
  //     tools: includeTools ? [searchProductsToolDefinition] : undefined,
  //     tool_choice: includeTools ? "auto" : undefined,
  //     response_format: { type: "json_object" },
  //     temperature: 0.2,
  //       max_tokens: 1000

  //   }),
  // });
  const lastMessage =
    messages[messages.length - 1]?.content ?? "";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: lastMessage,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  // if (!response?.ok) {
  //   const detail = await response.text();
  //   throw new Error(`OpenAI request failed: ${response.status} ${detail}`);
  // }

  // return (await response.json()) as OpenAiChatResponse;
  return response.text;
};

const safeParseJson = <T>(value: string | null): T | null => {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const serializeProductForModel = (product: ProductDocument) => ({
  _id: product._id.toString(),
  title: product.title,
  description: product.description,
  category: product.category,
  price: product.price,
  mrp: product.mrp,
  discountPercentage: product.discountPercentage,
  rating: product.rating,
  stock: product.stock,
  tags: product.tags,
  brand: product.brand,
});

const buildUserMessage = (request: ShoppingAssistantRequest) => {
  const context = request.context
    ? `\n\nFrontend context:\n${JSON.stringify(request.context)}`
    : "";

  return `${request.message}${context}`;
};

const executeToolCall = async (toolCall: ToolCall) => {
  if (toolCall.function.name !== "search_products") {
    throw new Error(`Unsupported tool call: ${toolCall.function.name}`);
  }

  const args = safeParseJson<SearchProductsToolArgs>(
    toolCall.function.arguments,
  ) ?? {
    query: "",
  };
  const result = await executeSearchProductsTool(args);

  return {
    args,
    result,
  };
};

const hydrateRecommendations = async (
  assistantResponse: AssistantJsonResponse,
  toolProducts: ProductDocument[],
): Promise<ShoppingRecommendation[]> => {
  const toolProductIds = new Set(
    toolProducts.map((product) => product._id.toString()),
  );

  const recommendations = assistantResponse.recommendations ?? [];
  const hydrated = await Promise.all(
    recommendations.map(async (recommendation) => {
      const productId = recommendation.productId;

      if (!productId || !toolProductIds.has(productId)) {
        return null;
      }

      const product = await getProductById(productId);
      if (!product) return null;

      return {
        product,
        uri:`/product/${product._id.toString()}`,
        reason:
          recommendation.reason ||
          `${product.brand} ${product.title} matches your requested budget and category.`,
      };
    }),
  );

  return hydrated.filter(
    (item): item is ShoppingRecommendation => item !== null,
  );
};
export const getShoppingRecommendations = async (
  request: ShoppingAssistantRequest,
): Promise<ShoppingAssistantResponse> => {

  const searchResult = await executeSearchProductsTool({
    query: request.message,
    category: request.context?.category,
    maxPrice: request.context?.budget,
    limit: 8,
  });

  const toolProducts = searchResult.products;
  const filtersUsed = searchResult.filtersUsed;

  const prompt = `
${shoppingAssistantPrompt}

USER REQUEST:
${request.message}

AVAILABLE PRODUCTS:
${JSON.stringify(
  toolProducts.map(serializeProductForModel),
  null,
  2
)}

IMPORTANT:

- Recommend ONLY products from AVAILABLE PRODUCTS.
- Never invent products.
- Return JSON only.

Expected format:

{
  "message": "short summary",
  "recommendations": [
    {
      "productId": "...",
      "reason": "..."
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  const parsed =
    safeParseJson<AssistantJsonResponse>(response.text ?? "") ?? {};

  const recommendations = await hydrateRecommendations(
    parsed,
    toolProducts,
  );

  return {
    message:
      parsed.message ||
      (recommendations.length
        ? "Here are products that match your request."
        : "No matching products are currently available."),

    recommendations,

    filtersUsed,

    toolCalls: [
      {
        name: "search_products",
        arguments: {
          query: request.message,
          category: request.context?.category,
          maxPrice: request.context?.budget,
          limit: 8,
        },
      },
    ],
  };
};

export default {
  getShoppingRecommendations,
};
