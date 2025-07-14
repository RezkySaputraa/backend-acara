import { Request, Response } from "express";
import * as Yup from "yup";

import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

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

    response.success(res, result, "Success registration");
  } catch (error) {
    response.error(res, error, "Failed registration");
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
      return response.unauthorized(res, "User not found");
    }

    // validasi password
    const validatePassword: boolean =
      encrypt(password) === userByIdentifier?.password;

    if (!validatePassword) {
      return response.unauthorized(res, "User not found");
    }

    const token = generateToken({
      id: userByIdentifier._id,
      role: userByIdentifier.role,
    });

    response.success(res, token, "Login Success");
  } catch (error) {
    response.error(res, error, "Login Failed");
  }
};

export const me = async (req: IReqUser, res: Response) => {
  /**
     #swagger.tags=["Auth"]
    #swagger.security = [{
    "bearerAuth": {}
    }]
     
     */

  try {
    const user = req.user;
    const result = await UserModel.findById(user?.id);

    response.success(res, result, "Success get user profile");
  } catch (error) {
    response.error(res, error, "Failed get user profile");
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

    response.success(res, user, "Success activation account");
  } catch (error) {
    response.error(res, error, "Failed activation account");
  }
};
