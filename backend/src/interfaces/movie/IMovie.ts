interface IMovie {
	TMDBId?: number | null;
	adult: boolean;
	backdrop_path?: string | null;
	budget?: number | null;
	genres?: string[] | null;
	id: string;
	overview?: string | null;
	popularity?: number | null;
	poster_path?: string | null;
	release_date?: string | null;
	status?: string | null;
	title: string;
}
export default IMovie;
