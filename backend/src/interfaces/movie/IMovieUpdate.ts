interface IMovieUpdate {
	id: string | null;
	title?: string | null;
	overview?: string | null;
	popularity?: number | null;
	release_date?: string | null;
	poster_path?: string | null;
	adult?: boolean | null;
	backdrop_path?: string | null;
	budget?: number | null;
	status?: string | null;
	TMDBId?: number | null;
}

export default IMovieUpdate;
