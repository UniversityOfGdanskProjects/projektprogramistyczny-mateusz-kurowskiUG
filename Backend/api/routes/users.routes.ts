import { Request, Response, Router } from "express";
import db from "../../db/connect";
import newUserInterface from "../../interfaces/newUser";
import { emailRegex, passwordRegex } from "../../data/regex";
const usersRouter = Router();

usersRouter.post("/register", async (req: Request, res: Response) => {
  if (!req.body)
    return res.status(400).send({ msg: "Please enter all fields" });
  if (!req.body["email"] || !req.body["password"])
    return res.status(400).send({
      msg: "Please enter all fields",
    });
  const { email, password } = req.body;
  if (!emailRegex.test(email))
    return res.status(400).send({ msg: "Invalid email" });
  if (password.length < 6)
    return res
      .status(400)
      .send({ msg: "Password must be at least 6 characters" });
  if (password.length > 20)
    return res
      .status(400)
      .send({ msg: "Password must be less than 20 characters" });

  if (!passwordRegex.test(password)) {
    return res.status(400).send({
      msg: "Password must contain at least one uppercase letter, one lowercase letter, and one special character",
    });
  }
  const newUser: newUserInterface = {
    email: email.trim(),
    password: password.trim(),
  };
  const registerResult = await db.createUser(newUser);
  if (!registerResult.result) {
    return res.status(400).send({ msg: "User already exists" });
  }
  console.log(registerResult.data);

  return res
    .status(200)
    .send({ msg: registerResult.msg, data: registerResult.data });
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

usersRouter.get("/profile/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ msg: "Please enter all fields" });
  const profileResult = await db.getUserProfile(id);
  if (!profileResult.result) {
    return res.status(400).json(profileResult);
  }
  return res.status(200).json(profileResult);
});
usersRouter.put("/profile", async (req: Request, res: Response) => {
  const { id, name, password, email, role } = req.body;
  if (!id) return res.status(400).json({ msg: "Please enter userId" });
  if (!name && !password && !email) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  const updateProfileResult = await db.updateUserProfile({
    id,
    password,
    email,
    role,
  });
  if (role)
    return res.status(403).json({ msg: "Updating role is not permitted" });
  if (!updateProfileResult.result) {
    return res.status(400).json(updateProfileResult);
  }
  return res.status(200).json(updateProfileResult);
});
usersRouter.get("/:id/stats", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ msg: "Please enter all fields" });
  const statsResult = await db.getUserStats(id);
  if (!statsResult.result) {
    return res.status(400).json(statsResult);
  }
  return res.status(200).json(statsResult);
});

export default usersRouter;
