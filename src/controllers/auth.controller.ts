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
  password: Yup.string()
    .required()
    .min(6, "Password minimal 6 karakter")
    .test(
      "atleast-one-uppercase-letter",
      "Contains atleast one uppercase letter",
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
      }
    )
    .test("atleast-one-number", "Contains atleast one number", (value) => {
      if (!value) return false;
      const regex = /^(?=.*\d)/;
      return regex.test(value);
    }),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Password not match"),
});

export const register: (req: Request, res: Response) => Promise<void> = async (
  req: Request,
  res: Response
) => {
  /**
   
  #swagger.tags=["Auth"]
    #swagger.requestBody = {
    required: true,
    schema: {$ref: "#/components/schemas/RegisterRequest"}
  }
   
   */

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
   #swagger.tags=["Auth"]
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
      isActive: true,
    });

    if (!userByIdentifier) {
      res.status(404).json({
        message: "User not found",
        data: null,
      });
      return;
    }

    // validasi password
    const validatePassword: boolean =
      encrypt(password) === userByIdentifier?.password;

    if (!validatePassword) {
      res.status(401).json({
        message: "Wrong username or password",
        data: null,
      });
      return;
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
     #swagger.tags=["Auth"]
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

export const activation = async (req: Request, res: Response) => {
  /**
   
  #swagger.tags= ["Auth"]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: "#/components/schemas/ActivationRequest"}
  }
   
   */

  try {
    const { code } = req.body as { code: string };

    const user = await UserModel.findOneAndUpdate(
      {
        activationCode: code,
      },
      {
        isActive: true,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "User successfully activated",
      data: user,
    });
  } catch (error) {
    const err = error as unknown as Error;
    res.status(400).json({
      message: err.message,
      data: null,
    });
  }
};
