import express from "express";
import router from "./routes/api.js";
import db from "./utils/database.js";
import docs from "./docs/route.js";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// ✅ Versi ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function init() {
  try {
    const PORT = 3000;
    const app = express();
    const result = await db();
    console.log("Database status :", result);

    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "../public")));

    app.get("/", (req, res) => {
      res.status(200).json({
        message: "Server is running",
        data: null,
      });
    });
    app.use("/api", router);

    docs(app);

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
