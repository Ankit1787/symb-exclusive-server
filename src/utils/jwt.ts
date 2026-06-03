import { Types } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/config.js";


export default function generateToken(user: { _id: Types.ObjectId }):string {
  const token = jwt.sign(
    {
      id: user._id,
    },

    config.jwtSecret,

    {
      expiresIn: "7d",
    },
  );
  return token;
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, config.jwtSecret);
  return decoded as JwtPayload;
}
