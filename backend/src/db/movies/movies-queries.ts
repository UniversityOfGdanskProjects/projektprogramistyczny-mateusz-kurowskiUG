enum EMovieQueries {
	getAllMovies = "MATCH (m:Movie) RETURN m",
	getMovieById = "MATCH (m:Movie {id: $id}) RETURN m",
}
export default EMovieQueries;
