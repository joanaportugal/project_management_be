import { Request, Response } from "express";
//import nodemailer from "nodemailer";

import db from "../db";

class MembersController {
  async add(req: Request, res: Response) {
    return res.status(200).send("Add Member To Project");
  }

  async getMembersByProjectId(req: Request, res: Response) {
    return res.status(200).send("Get Members By Project Id");
  }

  async updateMemberByProjectId(req: Request, res: Response) {
    return res.status(200).send("Update Member Role By Project Id");
  }

  async deleteMemberByProjectId(req: Request, res: Response) {
    return res.status(200).send("Delete Member By Project Id");
  }
}

export default MembersController;
