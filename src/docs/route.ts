import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger-output.json" with { type: "json" };
// import fs from "fs";
// import path from "path";

export default function docs(app: Express) {
  // const css = fs.readFileSync(
  //   path.resolve(
  //     __dirname,
  //     "../../node_modules/swagger-ui-dist/swagger-ui.css"
  //   ),
  //   "utf-8"
  // );

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerOutput, {
      customCssUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css",
      customJs: [
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js",
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.js",
      ],
    })
  );
}
