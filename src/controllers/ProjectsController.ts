import { Request, Response } from "express";

import db from "../db";
import ProjectInterface from "../interfaces/ProjectInterface";

import * as ProjectErrors from "../validators/Projects";

class ProjectsController {
  async getAllProjectsFromUser(req: Request, res: Response) {
    try {
      const user = await db("users")
        .select("*")
        .where("username", req.params.username)
        .first();

      if (!user) {
        return res
          .status(404)
          .json({ err: `User ${req.params.username} not found!` });
      }

      const list = await db("projects")
        .select("id")
        .join(
          "project_members",
          "projects.id",
          "=",
          "project_members.projectId"
        )
        .where("project_members.member", req.params.username);

      return res.status(200).json({ list: list.map(({ id }) => id) });
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Some error occurred while retrieving the projects." });
    }
  }

  async create(req: Request, res: Response) {
    if (ProjectErrors.geProjectCreateErrors(req.body)) {
      return res.status(400).json({
        err: ProjectErrors.geProjectCreateErrors(req.body),
      });
    }

    const owner = await db("users")
      .select("*")
      .where("username", req.body.owner)
      .first();

    if (!owner) {
      return res.status(404).json({ err: `User ${req.body.owner} not found!` });
    }

    const sameProject = await db("projects")
      .select("*")
      .where("name", req.body.name)
      .andWhere("owner", req.body.owner)
      .first();

    if (sameProject) {
      return res
        .status(400)
        .json({ err: "You already have a project with that name!" });
    }

    const projectItem: ProjectInterface = {
      name: req.body.name,
      icon: req.body.icon,
      description: req.body.description,
      owner: req.body.owner,
      status: req.body.status,
      members: [{ member: req.body.owner, role: "Leader" }],
    };

    const { members, ...obj } = projectItem;
    const trx = await db.transaction();
    try {
      const projectId = await trx("projects").insert(obj);

      const membersList = members?.map(({ member, role }) => ({
        member,
        role,
        projectId,
      }));

      await trx("project_members").insert(membersList);

      await trx.commit();
      return res.status(201).send({
        msg: `Project ${req.body.name} created!`,
        uri: `/projects/${projectId}`,
      });
    } catch (err) {
      await trx.rollback();
      return res
        .status(500)
        .json({ err: "Some error occurred while creating the project." });
    }
  }

  async getProjectById(req: Request, res: Response) {
    if (ProjectErrors.isIdInvalid(req.params.pID)) {
      return res
        .status(400)
        .json({ err: "Project id must be an integer number!" });
    }
    try {
      const project = await db("projects")
        .select("*")
        .where("id", parseInt(req.params.pID))
        .first();

      return project
        ? res.status(200).json({ project })
        : res
            .status(404)
            .json({ err: `Project with id ${req.params.pID} not found!` });
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Some error occurred while retrieving the project." });
    }
  }

  async updateProjectById(req: Request, res: Response) {
    if (
      ProjectErrors.getProjectUpdateErrors(req.body) ||
      ProjectErrors.isIdInvalid(req.params.pID)
    ) {
      return res.status(400).json({
        err:
          ProjectErrors.getProjectUpdateErrors(req.body) ||
          ProjectErrors.isIdInvalid(req.params.pID),
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

    const projectItem: ProjectInterface = {
      name: req.body.name,
      icon: req.body.icon,
      description: req.body.description,
      owner: req.body.owner,
      status: req.body.status,
    };

    try {
      await db("projects")
        .update(projectItem)
        .where("id", parseInt(req.params.pID));
      return res.status(200).json({ msg: `Project ${req.body.name} updated!` });
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Some error occurred while updating the project." });
    }
  }

  async deleteProjectById(req: Request, res: Response) {
    if (ProjectErrors.isIdInvalid(req.params.pID)) {
      return res
        .status(400)
        .json({ err: ProjectErrors.isIdInvalid(req.params.pID) });
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
      await db("projects").del("*").where("id", parseInt(req.params.pID));
      return res.status(200).send({
        msg: `Project ${project.name} deleted!`,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Some error occurred while deleting the project." });
    }
  }
}

export default ProjectsController;
