import { Request, Response, Router } from "express";
import db from "../../db/connect";
import newUserInterface from "../../interfaces/newUser";
import { emailRegex, passwordRegex } from "..";
const moviesRouter = Router();
moviesRouter.post("/:id/reviews", async (req: Request, res: Response) => {});
moviesRouter.get("/:id/reviews", async (req: Request, res: Response) => {});
moviesRouter.delete("/:id/reviews", async (req: Request, res: Response) => {});

export default moviesRouter;
