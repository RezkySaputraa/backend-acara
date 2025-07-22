import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import BannerModel, { bannerDAO, TypeBanner } from "../models/banner.model";
import { FilterQuery } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await bannerDAO.validate(req.body);
      const result = await BannerModel.create(req.body);
      response.success(res, result, "Success to create a banner");
    } catch (error) {
      response.error(res, error, "Failed to create a banner");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<TypeBanner> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await BannerModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await BannerModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          current: page,
          totalPage: Math.ceil(count / limit),
        },
        "Success find all banners"
      );
    } catch (error) {
      response.error(res, error, "Failed to find all banner");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await BannerModel.findById(id);

      if (!result) {
        return response.notfound(res, "Failed to find one a banner");
      }

      response.success(res, result, "Success find one a banner");
    } catch (error) {
      response.error(res, error, "Failed to find one a banner");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await BannerModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "Success to update a banner");
    } catch (error) {
      response.error(res, error, "Failed to update a banner");
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await BannerModel.findByIdAndDelete(id, {
        new: true,
      });
      response.success(res, result, "Success to remove a banner");
    } catch (error) {
      response.error(res, error, "Failed to remove a banner");
    }
  },
};
