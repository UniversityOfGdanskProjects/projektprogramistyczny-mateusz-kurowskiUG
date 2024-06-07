enum EWatchlistQueries {
	ADD_TO_WATCHLIST = `
	MATCH (u:User {id: $userId}),
     (m:Movie {id: $movieId})
      CREATE (u)-[:WATCHLIST]->(m)`,
	GET_WATCHLIST = `
	MATCH (u:User {id: $userId})-[:WATCHLIST]->(m:Movie)
	RETURN m`,
	DELETE_FROM_WATCHLIST = "MATCH (u:User {id: $userId})-[r:WATCHLIST]->(m:Movie {id: $movieId}) DELETE r",
}

export default EWatchlistQueries;
