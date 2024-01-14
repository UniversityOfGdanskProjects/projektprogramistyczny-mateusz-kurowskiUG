interface MovieInterface {
  id: string;
  title: string;
  TMDBId: number;
  overview?: string;
  popularity: number;
  release_date: string;
  poster_path: string;
  adult: boolean;
  backdrop_path: string;
  budget?: number;
  status?: string;
  genres?: { id: number; name: string }[];
}
export default MovieInterface;
