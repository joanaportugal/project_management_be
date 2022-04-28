import { Request, Response } from "express";

import db from "../db";

class ProjectsController {
  async create(req: Request, res: Response) {
    return res.status(200).send("Create Project");
  }

  async getAllProjectsFromUser(req: Request, res: Response) {
    return res.status(200).send("Get Projects From User");
  }

  async getProjectById(req: Request, res: Response) {
    return res.status(200).send("Get Project By Id");
  }

  async updateProjectById(req: Request, res: Response) {
    return res.status(200).send("Update Project Description");
  }

  async deleteProjectById(req: Request, res: Response) {
    return res.status(200).send("Delete Project");
  }
}

export default ProjectsController;
