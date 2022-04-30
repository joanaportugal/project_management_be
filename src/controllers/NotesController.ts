import { Request, Response } from "express";

import db from "../db";
import NoteInterface from "../interfaces/NoteInterface";

import * as NoteErrors from "../validators/Notes";

class NotesController {
  async create(req: Request, res: Response) {
    if (
      NoteErrors.isIdInvalid(req.params.pID) ||
      NoteErrors.hasAllParams(req.body)
    ) {
      return res.status(400).json({
        err:
          NoteErrors.isIdInvalid(req.params.pID) ||
          NoteErrors.hasAllParams(req.body),
      });
    }

    const project = await db("project_members")
      .select("*")
      .where("projectId", parseInt(req.params.pID))
      .andWhere("member", req.body.member)
      .first();

    if (!project) {
      return res.status(404).json({
        err: `Project with id ${parseInt(req.params.pID)} or member ${
          req.body.member
        } not found!`,
      });
    }

    try {
      const note: NoteInterface = {
        projectId: parseInt(req.params.pID),
        title: req.body.title,
        description: req.body.description,
        member: req.body.member,
      };
      await db("project_notes").insert(note);
      return res.status(201).send({
        msg: `Note ${req.body.title} created!`,
        uri: `/projects/${parseInt(req.params.pID)}/notes`,
      });
    } catch (err) {
      console.log(err);

      return res
        .status(500)
        .json({ err: "Some error occurred while creating the note." });
    }
  }

  async getNotesByProjectId(req: Request, res: Response) {
    if (NoteErrors.isIdInvalid(req.params.pID)) {
      return res.status(400).json({
        err: NoteErrors.isIdInvalid(req.params.pID),
      });
    }

    const project = await db("projects")
      .select("*")
      .where("id", parseInt(req.params.pID))
      .first();

    if (!project) {
      return res
        .status(404)
        .json({ err: `Project with id ${req.params.pID} not found!` });
    }

    try {
      const notes = await db("project_notes")
        .select("*")
        .where("projectId", parseInt(req.params.pID));

      return res.status(200).json({ notes });
    } catch (err) {
      return res.status(500).json({
        err: "Some error occurred while retrieving the project notes.",
      });
    }
  }

  async updateNoteByProjectId(req: Request, res: Response) {
    if (
      NoteErrors.isIdInvalid(req.params.pID) ||
      NoteErrors.hasAllParams(req.body) ||
      NoteErrors.titleQueryInvalid(req.query.title)
    ) {
      return res.status(400).json({
        err:
          NoteErrors.isIdInvalid(req.params.pID) ||
          NoteErrors.hasAllParams(req.body) ||
          NoteErrors.titleQueryInvalid(req.query.title),
      });
    }

    const project = await db("projects")
      .select("*")
      .where("id", parseInt(req.params.pID))
      .first();

    if (!project) {
      return res
        .status(404)
        .json({ err: `Project with id ${req.params.pID} not found!` });
    }

    const note = await db("project_notes")
      .select("*")
      .where("projectId", parseInt(req.params.pID))
      .andWhere("title", req.query.title as string)
      .first();

    if (!note) {
      return res
        .status(404)
        .json({ err: `Note ${req.query.title} not found!` });
    }

    try {
      await db("project_notes")
        .update({ title: req.body.title, description: req.body.description })
        .where("projectId", parseInt(req.params.pID))
        .andWhere("title", req.query.title as string);
      return res.status(200).json({ msg: `Note ${req.body.title} updated!` });
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Some error occurred while updating the note." });
    }
  }

  async deleteNoteByProjectId(req: Request, res: Response) {
    if (
      NoteErrors.isIdInvalid(req.params.pID) ||
      NoteErrors.titleQueryInvalid(req.query.title)
    ) {
      return res.status(400).json({
        err:
          NoteErrors.isIdInvalid(req.params.pID) ||
          NoteErrors.titleQueryInvalid(req.query.title),
      });
    }

    const project = await db("projects")
      .select("*")
      .where("id", parseInt(req.params.pID))
      .first();

    if (!project) {
      return res
        .status(404)
        .json({ err: `Project with id ${req.params.pID} not found!` });
    }

    const note = await db("project_notes")
      .select("*")
      .where("projectId", parseInt(req.params.pID))
      .andWhere("title", req.query.title as string)
      .first();

    if (!note) {
      return res
        .status(404)
        .json({ err: `Note ${req.query.title} not found!` });
    }

    try {
      await db("project_notes")
        .del("*")
        .where("projectId", parseInt(req.params.pID))
        .andWhere("title", req.query.title as string);
      return res.status(200).send({
        msg: `Note ${req.query.title} deleted!`,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Some error occurred while deleting the note." });
    }
  }
}

export default NotesController;
