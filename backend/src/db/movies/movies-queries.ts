enum EMovieQueries {
	getAllMovies = "MATCH (m:Movie) RETURN m",
	getMovieById = "MATCH (m:Movie {id: $id}) RETURN m",
	addReview = `
	MATCH (m:Movie {id: $id})
	MATCH (u:User {id: $userId})
	CREATE (r:Review {id: $reviewId, content: $content, rating: $rating, createdAt: apoc.create.currentTimestamp()})
	CREATE (u)-[:WROTE]->(r)
	CREATE (r)-[:REVIEWS]->(m)
	RETURN r
	`,
}
export default EMovieQueries;
