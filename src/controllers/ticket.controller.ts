import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import TicketModel, { ticketDAO, TypeTicket } from "../models/ticket.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await ticketDAO.validate(req.body);
      const result = await TicketModel.create(req.body);
      response.success(res, result, "Success to create a ticket");
    } catch (error) {
      response.error(res, error, "Failed to create a ticket");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<TypeTicket> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await TicketModel.find(query)
        .populate("events")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await TicketModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          current: page,
          totalPage: Math.ceil(count / limit),
        },
        "Success find all tickets"
      );
    } catch (error) {
      response.error(res, error, "Failed to find all tickets");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notfound(res, "Failed to find a ticket");
      }

      const result = await TicketModel.findById(id);

      if (!result) {
        return response.notfound(res, "Failed to find a ticket");
      }

      response.success(res, result, "Success find a ticket");
    } catch (error) {
      response.error(res, error, "Failed to find a ticket");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notfound(res, "Failed to update a ticket");
      }

      const result = await TicketModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "Success update a ticket");
    } catch (error) {
      response.error(res, error, "Failed to update a ticket");
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notfound(res, "Failed to remove a ticket");
      }

      const result = await TicketModel.findByIdAndDelete(id, {
        new: true,
      });
      response.success(res, result, "Success remove a ticket");
    } catch (error) {
      response.error(res, error, "Failed to remove a ticket");
    }
  },
  async findAllByEvent(req: IReqUser, res: Response) {
    try {
      const { eventId } = req.params;

      if (!isValidObjectId(eventId)) {
        return response.error(res, null, "tickets not found");
      }

      const result = await TicketModel.find({ events: eventId }).exec();

      response.success(res, result, "Success to find all ticket by event");
    } catch (error) {
      response.error(res, error, "Failed to find all ticket by event");
    }
  },
};
