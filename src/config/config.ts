 import dotenv from 'dotenv';
dotenv.config();

 interface Config  {
    port: number;
    mongoUri: string;
    jwtSecret: string;
    jwtExpire: string;

}

export const config: Config = {
    port: Number(process.env.PORT) || 5001,
    mongoUri: process.env.MONGO_URI || "mongodb://",
    jwtSecret: process.env.JWT_SECRET   || "jsonwebtoken",
    jwtExpire: process.env.JWT_EXPIRE || "7d"

}



