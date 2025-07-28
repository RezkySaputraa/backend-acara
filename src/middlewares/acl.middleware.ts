import { Response, NextFunction } from "express";
import { IReqUser } from "../utils/interfaces.js";
import response from "../utils/response.js";

export default (roles: string[]) => {
  return (req: IReqUser, res: Response, next: NextFunction): void => {
    const role = req.user?.role;

    if (!role || !roles.includes(role)) {
      return response.unauthorized(res, "Forbidden");
    }

    next();
  };
};
