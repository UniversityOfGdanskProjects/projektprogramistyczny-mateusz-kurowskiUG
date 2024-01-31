import MovieInterface from "../../../../interfaces/Movie.model";

export type TMovieAction = {
  type: string;
  payload: MovieInterface | number;
};

const movieReducer = (state: MovieInterface[], action: TMovieAction) => {
  switch (action.type) {
    case "add":
      return [...state, action.payload];
    case "remove":
      return state.filter((movie) => movie.id !== action.payload.id);
    case "refresh":
      return action.payload;
    case "filterByGenre":
      return state.filter((movie: MovieInterface) => {
        return movie.genres?.find((genre) => genre.TMDBId === action.payload);
      });

    default:
      return state;
  }
};

export default movieReducer;
