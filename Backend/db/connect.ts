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
import { emailRegex } from "../data/regex";
import Axios from "axios";
class Db {
  instance: Neode;
  envs: Envs;
  users: Model<User>;
  hash: Hash;
  regex: RegExp = emailRegex;
  tmdbHeaders = {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjAxMzkxMjUxNjBjMTQzYWE5ZmUzZDgwYTA1YzQ5ZCIsInN1YiI6IjY1N2Y3NzI5NTI4YjJlMDcyNDNiMGViZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-96365PpSY8BgLFO7CRfNrx8NBk1mXLiI_ycHcSOsKU",
  };
  constructor() {
    this.hash = createHash("sha256");
    this.getEnvs();
    this.setUp();
    this.users.deleteAll();
  }
  getEnvs() {
    dotenv.config();
    const envs = {
      TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN || "",
      API_KEY: process.env.API_KEY || "",
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

  async getTmdbMPopular(): Promise<DBResponse> {
    const url = "https://api.themoviedb.org/3/movie/popular?language=pl&page=1";
    try {
      const popular = await Axios.get(url, {
        headers: this.tmdbHeaders,
      });
      return { result: true, data: popular.data.results };
    } catch (err) {
      return { result: false, msg: err };
    }
  }
  async getTmdbMById(id: number): Promise<DBResponse> {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    try {
      const details = await Axios.get(url, { headers: this.tmdbHeaders });
      return { result: true, data: details.data };
    } catch (err) {
      return { result: false, msg: err };
    }
  }
  async getGenres(): Promise<DBResponse> {
    const url = "https://api.themoviedb.org/3/genre/movie/list?language=pl";
    try {
      const genres = await Axios.get(url, { headers: this.tmdbHeaders });
      return { result: true, data: genres.data.genres };
    } catch (err) {
      return { result: false, msg: err };
    }
  }
  async searchTmdb(query: string): Promise<DBResponse> {
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&language=pl&page=1&include_adult=false`;
    try {
      const search = await Axios.get(url, { headers: this.tmdbHeaders });
      return { result: true, data: search.data.results };
    } catch (err) {
      return { result: false, msg: err };
    }
  }
}
const db = new Db();

(async () => {
  // await db.users.deleteAll();
  // await db.createUser({
  //   email: "email@mail.com",
  //   password: "password",
  // });
  //   const y = await db.loginUser("", "");
  //   console.log(y);
  // const logged = await db.loginUser("email@mail.com", "password");
  // console.log(logged);
  // const popular = await db.getTmdbMPopular();
  // console.log(popular);
  // const moviesById = await db.getTmdbMById(22);
  // console.log(moviesById);
  // const genres = await db.getGenres();
  // console.log(genres);
  // const search = await db.searchTmdb("matrix");
  // console.log(search);
})();

export default db;
