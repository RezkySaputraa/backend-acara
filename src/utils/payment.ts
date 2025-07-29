import axios from "axios";
import { MIDTRANS_SERVER_KEY, MIDTRANS_TRANSACTION_URL } from "../utils/env.js";

export interface Payment {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
}

export type TypeResponsMidtrans = {
  token: string;
  redirect_url: string;
};

export default {
  async createLink(payload: Payment): Promise<TypeResponsMidtrans> {
    const result = await axios.post<TypeResponsMidtrans>(
      `${MIDTRANS_TRANSACTION_URL}`,
      {
        ...payload,
        callback: {
          finish: "https://frontend-acara-inky.vercel.app/payment/success",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(
            `${MIDTRANS_SERVER_KEY}:`
          ).toString("base64")}`,
        },
      }
    );

    if (result.status !== 201) {
      throw new Error("Payment failed");
    }

    return result?.data;
  },
};
