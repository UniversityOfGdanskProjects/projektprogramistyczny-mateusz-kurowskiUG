import axios from "axios";
import UserInterface from "../../../interfaces/User.model";
import MovieInterface from "../../../interfaces/Movie.model";

export const loadWatchlist = async (
  user: UserInterface,
  movie: MovieInterface
) => {
  const url = `http://localhost:3000/api/watchlist/`;
  const requestBody = {
    userId: user?.userId,
  };
  try {
    const request = await axios.post(url, requestBody);
    if (request.status === 200) {
      const watchlist: MovieInterface[] = request.data.data;
      const includesThisMovie = !!watchlist.find(
        (watchlistMovie) => watchlistMovie.id === movie?.id
      );
      setInWatchlist(includesThisMovie);
    } else {
      setInWatchlist(false);
      alert("some error else");
    }
  } catch (error) {
    alert("some error catch");
  }
};
