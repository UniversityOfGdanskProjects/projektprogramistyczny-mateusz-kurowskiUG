import MovieInterface from "./Movie";

interface PlaylistInterface {
  id: string;
  name: string;
  date: Date;
  movies?: MovieInterface[];
}
export default PlaylistInterface;
