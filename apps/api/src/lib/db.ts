import { createDb } from "@bunman/db";
import { env } from "../env.js";

export const db = createDb(env.DATABASE_URL);
