export interface GenreStats {
  genre: string;
  count: number;
}
interface UserStats {
  reviews: number;
  watchlist: number;
  playlists: number;
  genresStats: GenreStats[];
}
export default UserStats;
