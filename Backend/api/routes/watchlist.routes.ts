import { Request, Response, Router } from "express";
import db from "../../db/connect";
import newUserInterface from "../../interfaces/newUser";
import { emailRegex, passwordRegex } from "..";
const watchlistRouter = Router();
watchlistRouter.post("/", async (req: Request, res: Response) => {});
watchlistRouter.get("/", async (req: Request, res: Response) => {});
watchlistRouter.delete("/:id", async (req: Request, res: Response) => {});
export default watchlistRouter;
