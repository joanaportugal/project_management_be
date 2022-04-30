import { Request, Response } from "express";

import db from "../db";

import MemberInterface from "../interfaces/MemberInterface";
import * as MembersErrors from "../validators/Members";

class MembersController {
  async add(req: Request, res: Response) {
    let { members } = req.body;
    if (
      MembersErrors.getAddMembersErrors(members) ||
      MembersErrors.isIdInvalid(req.params.pID)
    ) {
      return res.status(400).json({
        err:
          MembersErrors.getAddMembersErrors(members) ||
          MembersErrors.isIdInvalid(req.params.pID),
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

    const users = await db("users")
      .select("*")
      .whereIn(
        "username",
        req.body.members.map((member: MemberInterface) => member.member)
      );

    if (users.length !== req.body.members.length) {
      return res.status(404).json({
        err: "We couldn't find some users inserted. Check spelling!",
      });
    }

    const membersList: Array<MemberInterface> = members.map(
      (member: MemberInterface) => member
    );

    try {
      await db("project_members").insert(
        membersList.map((item) => ({
          member: item.member,
          role: item.role,
          projectId: parseInt(req.params.pID),
        }))
      );
      return res.status(200).send({
        msg: "Members added to project!",
      });
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Some error occurred while adding the members." });
    }
  }

  async getMembersByProjectId(req: Request, res: Response) {
    if (MembersErrors.isIdInvalid(req.params.pID)) {
      return res.status(400).json({
        err: MembersErrors.isIdInvalid(req.params.pID),
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
      const members = await db("project_members")
        .select("*")
        .where("projectId", parseInt(req.params.pID));
      return res.status(200).json({ members });
    } catch (err) {
      return res.status(500).json({
        err: "Some error occurred while retrieving members from the project!",
      });
    }
  }

  async updateMemberByProjectId(req: Request, res: Response) {
    if (
      MembersErrors.isIdInvalid(req.params.pID) ||
      MembersErrors.isEditRoleInvalid(req.body.role)
    ) {
      return res.status(400).json({
        err:
          MembersErrors.isIdInvalid(req.params.pID) ||
          MembersErrors.isEditRoleInvalid(req.body.role),
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

    const user = await db("project_members")
      .select("*")
      .where("member", req.params.username)
      .first();

    if (!user) {
      return res.status(404).json({
        err: `Member ${req.params.username} not found on this project!`,
      });
    }

    try {
      await db("project_members")
        .update({ role: req.body.role })
        .where("projectId", parseInt(req.params.pID))
        .andWhere("member", req.params.username);
      return res
        .status(200)
        .json({ msg: `Member ${req.params.username} role updated!` });
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Some error occurred while updating the member role." });
    }
  }

  async deleteMemberByProjectId(req: Request, res: Response) {
    if (MembersErrors.isIdInvalid(req.params.pID)) {
      return res.status(400).json({
        err: MembersErrors.isIdInvalid(req.params.pID),
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

    if (project.owner === req.params.username) {
      return res.status(400).json({
        err: `Member ${req.params.username} it's the owner of the project. It can't be removed!`,
      });
    }

    const user = await db("project_members")
      .select("*")
      .where("member", req.params.username)
      .andWhere("projectId", parseInt(req.params.pID))
      .first();

    console.log(user);

    if (!user) {
      return res.status(404).json({
        err: `Member ${req.params.username} not found on this project!`,
      });
    }

    try {
      await db("project_members")
        .del("*")
        .where("projectId", parseInt(req.params.pID))
        .andWhere("member", req.params.username);
      return res.status(200).send({
        msg: `Member ${req.params.username} deleted from the project!`,
      });
    } catch (err) {
      return res.status(500).json({
        err: "Some error occurred while deleting member from the project.",
      });
    }

    return res.status(200).send("Delete Member By Project Id");
  }
}

export default MembersController;
