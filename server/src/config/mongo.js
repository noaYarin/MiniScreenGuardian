import mongoose from "mongoose";
import { env } from "./env.js";
import logger from "../utils/logger.js";

export async function connectMongo() {
  if (!env.MONGO_URI) throw new Error("MONGO_URI is missing");
  await mongoose.connect(env.MONGO_URI);
  logger.info("Mongo connected");
}