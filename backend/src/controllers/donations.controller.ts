import { Request, Response } from "express";
import { instance } from "..";
import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
interface AuthRequest extends Request {
  auth?: any;
}

export const newDonation = (req: AuthRequest, res: Response) => {
  const { amount } = req.body;
  const auth = req.auth;
  const citizenId = req.auth.userId;

  var options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "order_rcptid_11",
  };

  instance.orders.create(options, function (err, order) {
    if (!err) {
      return res.send(order);
    }
    res.status(500).json({ error: "Server error! Contact Admin" });
  });
};
