import { Request, Response, Router } from "express";
import db from "../../db/connect";
import newUserInterface from "../../interfaces/newUser";
const adminRouter = Router();
adminRouter.get("/users", async (req: Request, res: Response) => {
  const users = await db.getUsers();
  if (!users) return res.status(400).json(users);
  return res.status(200).send(users);
});
adminRouter.put("/users/:id", async (req: Request, res: Response) => {});
adminRouter.post("/movies", async (req: Request, res: Response) => {});
adminRouter.put("/movies/:id", async (req: Request, res: Response) => {});
adminRouter.delete("/movies/:id", async (req: Request, res: Response) => {});
export default adminRouter;
