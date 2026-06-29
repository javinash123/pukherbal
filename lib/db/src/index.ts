export * from "./models";
export { pool } from "./models";

export async function connectDB(): Promise<void> {
  const { pool } = await import("./models");
  await pool.query("SELECT 1");
  console.log("PostgreSQL connected");
}
