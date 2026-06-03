

import { Request, Response, NextFunction } from "express";
import  * as z from "zod";
export const validateRequest = (schema: z.ZodType) =>(req:Request,res:Response,next:NextFunction) =>{

    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: z.treeifyError(result.error),
      });
    }
    req.body = result.data;
    next();
  
}