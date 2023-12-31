import { Request, Response, Router } from "express";
import db from "../../db/connect";
import newUserInterface from "../../interfaces/newUser";
import { emailRegex, passwordRegex } from "..";
const TMDBRouter = Router();

TMDBRouter.get("/movies/popular", async (req: Request, res: Response) => {});
TMDBRouter.get("/movies/:id", async (req: Request, res: Response) => {});
TMDBRouter.get("/movies/search", async (req: Request, res: Response) => {});
TMDBRouter.get("/movies/genres", async (req: Request, res: Response) => {});

export default TMDBRouter;
