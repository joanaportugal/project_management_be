import { Request, Response } from "express";

import db from "../db";

class NotesController {
  async create(req: Request, res: Response) {
    return res.status(200).send("Add Note To Project");
  }

  async getNotesByProjectId(req: Request, res: Response) {
    return res.status(200).send("Get Notes By Project Id");
  }

  async updateNoteByProjectId(req: Request, res: Response) {
    return res.status(200).send("Update Note By Project Id");
  }

  async deleteNoteByProjectId(req: Request, res: Response) {
    return res.status(200).send("Delete Note By Project Id");
  }
}

export default NotesController;
