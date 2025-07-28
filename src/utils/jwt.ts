import jwt from "jsonwebtoken";
import { SECRET } from "./env.js";
import { IUserToken } from "./interfaces.js";

export const generateToken = (user: IUserToken): string => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "1h",
  });

  return token;
};

export const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as IUserToken;
  return user;
};
