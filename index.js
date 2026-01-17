import express from "express";
import connectToMongoDB from "./connect.js";
import urlRoute from "./Routes/url.js"; // Pre-emptively importing route as per plan, though not created/exported properly yet, will fix next.
// Actually, I should stick to just connection first to avoid errors if file doesn't exist or export.
// But the plan says "Update index.js to use connection".
// I'll add the connection logic.

import { handleShortUrlRedirect } from "./Controllers/url.js";

const app = express();
const PORT = 3000;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log("Mongo error", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);

app.get("/:shortId", handleShortUrlRedirect);


app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
