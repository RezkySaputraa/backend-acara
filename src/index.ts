import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./utils/database";

async function init() {
  try {
    const result = await db();

    console.log("Database status :", result);

    const app = express();
    app.use(bodyParser.json());
    const PORT = 3000;

    app.get("/", (req, res) => {
      res.status(200).json({
        message: "Server is running",
        data: null,
      });
    });

    app.use("/api", router);

    app.listen(PORT, () => {
      console.log(`Server running on port htttp://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
