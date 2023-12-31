import express, { Router } from "express";
import cors from "cors";
import usersRouter from "./routes/users.routes";
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const app = express();
const port = 3000;
app.use(cors());
const router = Router();
router.use("/api/users", usersRouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
