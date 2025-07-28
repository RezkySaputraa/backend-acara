import { Response, NextFunction } from "express";
import { getUserData } from "../utils/jwt.js";
import { IReqUser } from "../utils/interfaces.js";
import response from "../utils/response.js";

export default (req: IReqUser, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    return response.unauthorized(res);
  }

  const [prefix, token] = authorization.split(" ");

  if (!(prefix === "Bearer" && token)) {
    return response.unauthorized(res);
  }

  const user = getUserData(token);

  if (!user) {
    return response.unauthorized(res);
  }

  req.user = user;
  next();
};
