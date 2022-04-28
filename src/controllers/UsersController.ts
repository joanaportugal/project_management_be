import { Request, Response } from "express";
//import nodemailer from "nodemailer";

import db from "../db";

class UsersController {
  async login(req: Request, res: Response) {
    return res.status(200).send("Login");
  }

  async register(req: Request, res: Response) {
    return res.status(200).send("Register");
  }

  async update(req: Request, res: Response) {
    return res.status(200).send("Update");
  }

  async deleteAccount(req: Request, res: Response) {
    return res.status(200).send("Delete Account");
  }
}

export default UsersController;
