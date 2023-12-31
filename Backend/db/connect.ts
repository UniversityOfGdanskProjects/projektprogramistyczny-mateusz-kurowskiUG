import Neode, { Model } from "neode";
import dotenv from "dotenv";
import Envs from "../interfaces/envs";
import userSchema from "./models/User";
import { v4 as uuidv4 } from "uuid";
import newUserInterface from "../interfaces/newUser";
import UserInterface from "../interfaces/User";
import { createHash, Hash } from "crypto";
import DBResponse from "../interfaces/DBResponse";
import jwt from "jsonwebtoken";
import { emailRegex } from "../api";
class Db {
  instance: Neode;
  envs: Envs;
  users: Model<User>;
  hash: Hash;
  regex: RegExp = emailRegex;
  constructor() {
    this.hash = createHash("sha256");
    this.getEnvs();
    this.setUp();
    this.users.deleteAll();
  }
  getEnvs() {
    dotenv.config();
    const envs = {
      NEO4J_URI: process.env.NEO4J_URI || "",
      NEO4J_USERNAME: process.env.NEO4J_USERNAME || "",
      NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || "",
    };
    this.envs = envs;
  }
  loadModels() {
    this.users = this.instance.model("User", userSchema);
    // const movies = this.instance.model("Movie", movieSchema);
  }

  setUp() {
    this.instance = new Neode(
      this.envs.NEO4J_URI,
      this.envs.NEO4J_USERNAME,
      this.envs.NEO4J_PASSWORD
    );
    this.loadModels();
  }

  async getUsers(): Promise<DBResponse> {
    const users = await (await this.users.all()).toJson();
    return { result: true, data: users };
  }

  async createUser(user: newUserInterface): Promise<DBResponse> {
    const id = uuidv4();
    if (!this.regex.test(user.email)) {
      return { result: false, msg: "Invalid email" };
    }
    const foundEmail = (await this.users.all({ email: user.email })).length;
    if (foundEmail) {
      return { result: false, msg: "User already exists" };
    }
    const hashedPassword = createHash("sha256")
      .update(user.password)
      .digest("hex");

    const newUser = { ...user, id, password: hashedPassword };
    const result = await (await this.users.create(newUser)).toJson();
    return { result: true, data: result };
  }

  async loginUser(email: string, password: string): Promise<DBResponse> {
    const user = await (await this.users.all({ email })).first();
    if (!user) {
      return { result: false, msg: "Wrong email or password" };
    }
    if (user.get("password") !== this.hash.update(password).digest("hex")) {
      return { result: false, msg: "Wrong email or password" };
    }
    const userJson = await user.toJson();
    return { result: true, data: userJson };
  }
}
const db = new Db();

(async () => {
  await db.users.deleteAll();
  await db.createUser({
    email: "email@mail.com",
    password: "password",
  });
  //   const y = await db.loginUser("", "");
  //   console.log(y);
  const logged = await db.loginUser("email@mail.com", "password");
  console.log(logged);
})();

export default db;
