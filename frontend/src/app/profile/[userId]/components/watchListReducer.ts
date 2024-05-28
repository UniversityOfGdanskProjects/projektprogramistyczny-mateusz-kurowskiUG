import MovieInterface from "../../../../../interfaces/Movie.model";

export type TWachlistReducer = {
  prevState: MovieInterface[];
  action: TActionWatchlist;
};

export type TActionWatchlist = {
  type: "sort" | "set" | "remove" | "filterByGenre" | "reset" | "filterByName";
  payload:
    | {
        field: string;
        order: "ASC" | "DESC";
      }
    | MovieInterface[]
    | { id: string };
};

export const watchlistReducer = (
  state: MovieInterface[],
  action: TActionWatchlist
) => {
  switch (action.type) {
    case "sort":
      return [...state].sort((a: MovieInterface, b: MovieInterface) => {
        const { field } = action.payload;
        const order = action.payload?.order === "ASC" ? 1 : -1;
        if (a[field] > b[field]) {
          return 1 * order;
        }
        if (a[field] < b[field]) {
          return -1 * order;
        }
        return 0;
      });

    case "filterByGenre":
      return [...state].filter((movie) => {
        const { value } = action.payload;
        const movieGenres = movie.genres.map((genre) => genre.id);
        return movieGenres.includes(value);
      });

    case "filterByName":
      return [...state].filter((movie) => {
        const { title } = action.payload;
        const regex = new RegExp(title, "gi");
        return regex.test(movie.title);
      });

    case "set":
      return action.payload;

    case "remove":
      return state.filter((movie) => movie.id !== action.payload);
    default:
      return state;
  }
};
