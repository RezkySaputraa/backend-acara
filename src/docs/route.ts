import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger-output.json";

export default function docs(app: Express) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerOutput, {
      customCssUrl: "/swagger-ui.css",
    })
  );
}
