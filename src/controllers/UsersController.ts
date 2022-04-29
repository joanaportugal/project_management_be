import { Request, Response } from "express";
import bcrypt from "bcrypt";

import db from "../db";

import * as UserErrors from "../validators/Users";
import UserInterface from "../interfaces/UserInterface";

class UsersController {
  async register(req: Request, res: Response) {
    if (UserErrors.getUsersRegisterErrors(req.body)) {
      return res.status(400).json({
        err: UserErrors.getUsersRegisterErrors(req.body),
      });
    }

    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const userItem: UserInterface = {
      username: req.body.username,
      email: req.body.email,
      name: req.body.name,
      avatar: req.body.avatar,
      password: hashedPassword,
    };

    try {
      await db("users").insert(userItem);

      return res.status(201).send({
        msg: `Username ${req.body.username} created!`,
        uri: `/users/${req.body.username}`,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Some error occurred while creating the account." });
    }
  }

  async login(req: Request, res: Response) {
    if (UserErrors.getUsersLoginErrors(req.body)) {
      return res.status(400).json({
        err: UserErrors.getUsersLoginErrors(req.body),
      });
    }
    try {
      const auth = req.body.username || req.body.email;
      const user = await db("users")
        .select("*")
        .where("username", auth)
        .orWhere("email", auth)
        .first();

      const value = await bcrypt.compare(req.body.password, user.password);

      if (!user) {
        return res
          .status(400)
          .json({ error: "The email or username and password doesn't match!" });
      }

      return value
        ? res.status(200).send({ msg: "User logged!" })
        : res.status(400).json({
            error: "The email or username and password doesn't match!",
          });
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Some error occurred while trying to login." });
    }
  }

  async profile(req: Request, res: Response) {
    try {
      const user = await db("users")
        .select("*")
        .where("username", req.params.username)
        .first();
      return user
        ? res.status(200).json({ user })
        : res.status(404).json({
            error: `User ${req.params.username} not found!`,
          });
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Some error occurred while looking for the profile." });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await db("users")
        .select("*")
        .where("username", req.params.username)
        .first();

      if (!user) {
        return res.status(404).json({
          error: `User ${req.params.username} not found!`,
        });
      } else if (UserErrors.getUsersUpdateErrors(req.body)) {
        return res.status(400).json({
          err: UserErrors.getUsersUpdateErrors(req.body),
        });
      } else if (req.body.password) {
        const passwordsAreEqual = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (passwordsAreEqual) {
          return res.status(400).json({
            err: "Please provide a different password!",
          });
        }
      }

      try {
        if (req.body.avatar) {
          await db("users")
            .update({ avatar: req.body.avatar })
            .where("username", req.params.username);
        }
        if (req.body.password) {
          const saltRounds = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(
            req.body.password,
            saltRounds
          );
          await db("users")
            .update({ password: hashedPassword })
            .where("username", req.params.username);
        }
        return res.status(200).send({
          msg: `Username ${req.params.username} updated!`,
        });
      } catch (err) {
        return res
          .status(500)
          .json({ err: "Some error occurred while updating the profile." });
      }
    } catch (err) {
      console.log(err);

      return res
        .status(500)
        .json({ err: "Some error occurred while looking for the profile." });
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      const user = await db("users")
        .select("*")
        .where("username", req.params.username)
        .first();

      if (!user) {
        return res.status(404).json({
          error: `User ${req.params.username} not found!`,
        });
      }

      await db("users").del("*").where("username", req.params.username);

      return res.status(200).send({
        msg: `Username ${req.params.username} deleted!`,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Some error occurred while deleting the account." });
    }
  }
}

export default UsersController;
