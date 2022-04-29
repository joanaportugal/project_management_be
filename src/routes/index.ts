import express, { Request, Response, NextFunction } from "express";

import MembersController from "../controllers/MembersController";
import NotesController from "../controllers/NotesController";
import ProjectsController from "../controllers/ProjectsController";
import UsersController from "../controllers/UsersController";

const router = express.Router();

const users = new UsersController();
const projects = new ProjectsController();
const members = new MembersController();
const notes = new NotesController();

router.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const diffSeconds = (Date.now() - start) / 1000;
    console.log(
      `${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`
    );
  });
  next();
});

router.post("/users", users.register);
router.post("/login", users.login);
router.get("/users/:username", users.profile);
router.patch("/users/:username", users.update);
router.delete("/users/:username", users.deleteAccount);

router.get("/users/:username/projects", projects.getAllProjectsFromUser);
router.post("/projects", projects.create);
router.get("/projects/:pID", projects.getProjectById);
router.put("/projects/:pID", projects.updateProjectById);
router.delete("/projects/:pID", projects.deleteProjectById);

router.post("/projects/:pID/members", members.add);
router.get("/projects/:pID/members", members.getMembersByProjectId);
router.patch(
  "/projects/:pID/members/:username",
  members.updateMemberByProjectId
);
router.delete(
  "/projects/:pID/members/:username",
  members.deleteMemberByProjectId
);

router.post("/projects/:pID/notes", notes.create);
router.get("/projects/:pID/notes", notes.getNotesByProjectId);
router.patch("/projects/:pID/notes/:nID", notes.updateNoteByProjectId);
router.delete("/projects/:pID/notes/:nID", notes.deleteNoteByProjectId);

router.all("*", (req, res) => {
  return res.status(404).send({
    err: `${req.method} ${req.originalUrl} isn't a real path on this API.`,
  });
});

export default router;
