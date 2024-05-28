import MovieInterface from "./Movie.model";

interface PlaylistInterface {
  id: number;
  name: string;
  date: string;
  movies: MovieInterface[];
}
export default PlaylistInterface;
