import { Request, Response, NextFunction } from "express";
import response from "../utils/response.js";

export default {
  serverRoute() {
    return (req: Request, res: Response, next: NextFunction) => {
      response.notfound(res, "Route not found");
    };
  },
  serverError() {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
      response.error(res, err, err.message);
    };
  },
};
