import { Request, Response, NextFunction } from "express";
import { getUserData, IUserToken } from "../utils/jwt";

export interface IReqUser extends Request {
  user?: IUserToken;
}

export default (req: IReqUser, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    return res
      .status(400)
      .json({ message: "Bad Request", data: null }) as unknown as void;
  }

  const [prefix, token] = authorization.split(" ");

  if (!(prefix === "Bearer" && token)) {
    return res
      .status(401)
      .json({ message: "Unauthorized", data: null }) as unknown as void;
  }

  const user = getUserData(token);

  if (!user) {
    return res
      .status(401)
      .json({ message: "Unauthorized", data: null }) as unknown as void;
  }

  req.user = user;
  next();
};
