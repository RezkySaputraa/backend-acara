import express from "express";
import router from "./routes/api";
import db from "./utils/database";
import docs from "./docs/route";
import cors from "cors";
import path from "path";

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
