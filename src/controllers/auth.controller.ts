import { Request, Response } from "express";
import * as Yup from "yup";

import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Password not match"),
});

export const register: (req: Request, res: Response) => Promise<void> = async (
  req: Request,
  res: Response
) => {
  try {
    const { fullName, username, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    await registerValidateSchema.validate({
      fullName,
      username,
      email,
      password,
      confirmPassword,
    });

    const result = await UserModel.create({
      fullName,
      email,
      username,
      password,
    });

    res.status(200).json({
      message: "Success registration",
      data: result,
    });
  } catch (error) {
    const err = error as unknown as Error;
    res.status(400).json({
      message: err.message,
      data: null,
    });
  }
};

export const login: (req: Request, res: Response) => Promise<void> = async (
  req: Request,
  res: Response
) => {
  /**
   
  #swagger.requestBody = {
    required: true,
    schema: {$ref: "#/components/schemas/LoginRequest"}
  }
   
   */
  try {
    const { identifier, password } = req.body as unknown as TLogin;

    //ambil data user berdasarkan identifier -> email dan username
    const userByIdentifier = await UserModel.findOne({
      $or: [
        {
          email: identifier,
        },
        {
          username: identifier,
        },
      ],
    });

    if (!userByIdentifier) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      }) as unknown as void;
    }

    // validasi password
    const validatePassword: boolean =
      encrypt(password) === userByIdentifier?.password;

    if (!validatePassword) {
      return res.status(401).json({
        message: "Wrong username or password",
        data: null,
      }) as unknown as void;
    }

    const token = generateToken({
      id: userByIdentifier._id,
      role: userByIdentifier.role,
    });

    res.status(200).json({
      message: "Login Success",
      data: token,
    });
  } catch (error) {
    const err = error as unknown as Error;
    res.status(400).json({
      message: err.message,
      data: null,
    });
  }
};

export const me = async (req: IReqUser, res: Response) => {
  /**
     
    #swagger.security = [{
    "bearerAuth": []
    }]
     
     */

  try {
    const user = req.user;
    const result = await UserModel.findById(user?.id);

    res.status(200).json({
      message: "Success get user profile",
      data: result,
    });
  } catch (error) {
    const err = error as unknown as Error;
    res.status(400).json({
      message: err.message,
      data: null,
    });
  }
};
