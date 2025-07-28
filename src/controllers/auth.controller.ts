import { Request, Response } from "express";

import UserModel, {
  userDTO,
  userLoginDTO,
  userUpdatePasswordDTO,
} from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

export async function updateProfile(req: IReqUser, res: Response) {
  try {
    const userId = req.user?.id;

    const { fullName, profilePicture } = req.body;

    const result = await UserModel.findByIdAndUpdate(
      userId,
      {
        fullName,
        profilePicture,
      },
      {
        new: true,
      }
    );

    if (!result) {
      return response.notfound(res, "user not found");
    }

    response.success(res, result, "Success to update profile");
  } catch (error) {
    response.error(res, error, "Failed to update profile");
  }
}

export async function updatePassword(req: IReqUser, res: Response) {
  try {
    const userId = req.user?.id;
    const { oldPassword, password, confirmPassword } = req.body;

    await userUpdatePasswordDTO.validate({
      oldPassword,
      password,
      confirmPassword,
    });

    const user = await UserModel.findById(userId);

    if (!user || user.password !== encrypt(oldPassword))
      return response.notfound(res, "user not found");

    const result = await UserModel.findByIdAndUpdate(
      userId,
      {
        password: encrypt(password),
      },
      {
        new: true,
      }
    );

    response.success(res, result, "Success to update password");
  } catch (error) {
    response.error(res, error, "Failed to update password");
  }
}

export const register: (req: Request, res: Response) => Promise<void> = async (
  req: Request,
  res: Response
) => {
  try {
    const { fullName, username, email, password, confirmPassword } = req.body;

    await userDTO.validate({
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
  try {
    const { identifier, password } = req.body;

    await userLoginDTO.validate({ identifier, password });

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
  try {
    const user = req.user;
    const result = await UserModel.findById(user?.id);

    response.success(res, result, "Success get user profile");
  } catch (error) {
    response.error(res, error, "Failed get user profile");
  }
};

export const activation = async (req: Request, res: Response) => {
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
