import express from "express";
import cors from "cors";
import helmet from "helmet";
import useragent from "express-useragent";
import dotenv from "dotenv";

import connectToMongoDB from "./connect.js";
import { connectRedis } from "./redis.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (safe to apply before DB connections)
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (useragent && useragent.express) {
  app.use(useragent.express());
} else if (useragent && useragent.default && useragent.default.express) {
  app.use(useragent.default.express());
}

const startServer = async () => {
  // 1. Connect to MongoDB
  await connectToMongoDB(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/short-url"
  ).then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("Mongo error:", err));

  // 2. Connect to Redis
  await connectRedis();

  // 3. Mount routes AFTER Redis is ready (RedisStore needs an open connection)
  const { default: apiRoutes } = await import("./routes/apiRoutes.js");
  const { default: redirectRoutes } = await import("./routes/redirectRoutes.js");

  app.use("/api/url", apiRoutes);
  app.use("/", redirectRoutes);

  // Centralized error handler (must be last)
  app.use(errorHandler);

  // 4. Start listening
  if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  }
};

startServer();

export default app;

