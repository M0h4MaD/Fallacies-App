import "dotenv/config";
import { createApp } from "./app.js";
import { connectDB } from "./config/prisma.js";
import { startPoolRefillWorker } from "./workers/poolRefillWorker.js";

const PORT = process.env.PORT ?? 5000;

async function main() {
  await connectDB();
  const app = createApp();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  startPoolRefillWorker();
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
