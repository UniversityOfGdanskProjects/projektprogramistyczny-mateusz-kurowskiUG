import axios from "axios";
import { Request, Response, Router } from "express";

const castRouter = Router();
castRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);

  if (!req.params.id) {
    return res.status(400).send({ message: "Missing cast id" });
  }
  try {
    const castRequest = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/credits`,
      {
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjAxMzkxMjUxNjBjMTQzYWE5ZmUzZDgwYTA1YzQ5ZCIsInN1YiI6IjY1N2Y3NzI5NTI4YjJlMDcyNDNiMGViZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-96365PpSY8BgLFO7CRfNrx8NBk1mXLiI_ycHcSOsKU",
        },
      }
    );
    const cast = castRequest.data.cast.filter((cast) => {
      return cast.order <= 10;
    });
    return res.status(200).send({ message: "Cast found", cast });
  } catch (error) {
    return res.status(404).send({ message: "Cast not found", cast: [] });
  }
});

export default castRouter;
