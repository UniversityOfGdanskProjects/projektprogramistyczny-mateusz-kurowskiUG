import { Request, Response, Router } from "express";
import db from "../../db/connect";
import newUserInterface from "../../interfaces/newUser";
const adminRouter = Router();
adminRouter.get("/users", async (req: Request, res: Response) => {});
adminRouter.put("/users/:id", async (req: Request, res: Response) => {});
adminRouter.post("/movies", async (req: Request, res: Response) => {});
adminRouter.put("/movies/:id", async (req: Request, res: Response) => {});
adminRouter.delete("/movies/:id", async (req: Request, res: Response) => {});
export default adminRouter;
