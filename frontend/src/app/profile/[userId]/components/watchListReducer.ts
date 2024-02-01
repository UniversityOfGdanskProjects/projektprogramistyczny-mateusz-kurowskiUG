import MovieInterface from "../../../../../interfaces/Movie.model";

export type TWachlistReducer = {
  prevState: MovieInterface[];
  action: TActionWatchlist;
};

export type TActionWatchlist = {
  type: "sort" | "set";
  payload:
    | {
        field: string;
        order: "asc" | "desc";
      }
    | MovieInterface[];
};

export const watchlistReducer = (
  state: MovieInterface[],
  action: TActionWatchlist
) => {
  switch (action.type) {
    case "sort":
      return [...state].sort((a: MovieInterface, b: MovieInterface) => {
        const { field } = action.payload;
        const order = action.payload?.order === "asc" ? 1 : -1;
        if (a[field] > b[field]) {
          return 1 * order;
        }
        if (a[field] < b[field]) {
          return -1 * order;
        }
        return 0;
      });
    case "set":
      return action.payload;
    default:
      return state;
  }
};
