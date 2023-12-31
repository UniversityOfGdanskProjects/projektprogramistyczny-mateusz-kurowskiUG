import { Request, Response, Router } from "express";
import db from "../../db/connect";
import newUserInterface from "../../interfaces/newUser";
import { emailRegex, passwordRegex } from "..";
const usersRouter = Router();

usersRouter.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  if (!emailRegex.test(email))
    return res.status(400).json({ msg: "Invalid email" });
  if (password.length < 6)
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters" });
  if (password.length > 20)
    return res
      .status(400)
      .json({ msg: "Password must be less than 20 characters" });

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      msg: "Password must contain at least one uppercase letter, one lowercase letter, and one special character",
    });
  }
  const newUser: newUserInterface = {
    email: email.trim(),
    password: password.trim(),
  };
  const registerResult = await db.createUser(newUser);
  if (!registerResult.result) {
    return res.status(400).json({ msg: "User already exists" });
  }
  return res.status(200).json(registerResult);
});

usersRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  const loginResult = await db.loginUser(email.trim(), password.trim());
  if (!loginResult) {
    return res.status(400).json({ msg: "User does not exist" });
  }
  return res.status(200).json(loginResult);
});

usersRouter.get("/profile", async (req: Request, res: Response) => {});
usersRouter.put("/profile", async (req: Request, res: Response) => {});
usersRouter.get("/:id/stats", async (req: Request, res: Response) => {});

export default usersRouter;
