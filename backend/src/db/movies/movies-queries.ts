enum EMovieQueries {
	GET_ALL_MOVIES = "MATCH (m:Movie) RETURN m",
	GET_MOVIE_BY_ID = "MATCH (m:Movie {id: $id}) RETURN m",
	ADD_REVIEW = `
	MATCH (m:Movie {id: $id})
	MATCH (u:User {id: $userId})
	CREATE (r:Review {id: $reviewId, content: $content, rating: $rating, createdAt: apoc.create.currentTimestamp()})
	CREATE (u)-[:WROTE]->(r)
	CREATE (r)-[:REVIEWS]->(m)
	RETURN r
	`,
	GET_MOVIE_PAGE = `
	MATCH (m:Movie)
	RETURN m
	SKIP toInteger(($pageNumber - 1) * $pageSize)
	LIMIT toInteger($pageSize)`,
	CREATE_MOVIE_WITHOUT_GENRES = `
	CALL apoc.create.node(['Movie'], {
		id: $id,
		title: $title,
		TMDBId: CASE WHEN $TMDBId IS NOT NULL THEN $TMDBId ELSE NULL END,
		overview: CASE WHEN $overview IS NOT NULL THEN $overview ELSE NULL END,
		popularity: CASE WHEN $popularity IS NOT NULL THEN $popularity ELSE NULL END,
		release_date: CASE WHEN $release_date IS NOT NULL THEN $release_date ELSE NULL END,
		poster_path: CASE WHEN $poster_path IS NOT NULL THEN $poster_path ELSE NULL END,
		adult: $adult,
		backdrop_path: CASE WHEN $backdrop_path IS NOT NULL THEN $backdrop_path ELSE NULL END,
		budget: CASE WHEN $budget IS NOT NULL THEN $budget ELSE NULL END,
		status: CASE WHEN $status IS NOT NULL THEN $status ELSE NULL END
	  }) YIELD node
	  RETURN node`,
	CREATE_MOVIE_WITH_GENRES = `
	MERGE (g:Genre) WHERE g.name IN $genres
	CALL apoc.create.node(['Movie'], {
		id: $id,
		title: $title,
		TMDBId: CASE WHEN $TMDBId IS NOT NULL THEN $TMDBId ELSE NULL END,
		overview: CASE WHEN $overview IS NOT NULL THEN $overview ELSE NULL END,
		popularity: CASE WHEN $popularity IS NOT NULL THEN $popularity ELSE NULL END,
		release_date: CASE WHEN $release_date IS NOT NULL THEN $release_date ELSE NULL END,
		poster_path: CASE WHEN $poster_path IS NOT NULL THEN $poster_path ELSE NULL END,
		adult: $adult,
		backdrop_path: CASE WHEN $backdrop_path IS NOT NULL THEN $backdrop_path ELSE NULL END,
		budget: CASE WHEN $budget IS NOT NULL THEN $budget ELSE NULL END,
		status: CASE WHEN $status IS NOT NULL THEN $status ELSE NULL END
	  }) YIELD node
	  CREATE (node)-[:HAS_GENRE]->(g)
	  RETURN node`,
	UPDATE_MOVIE_WITHOUT_GENRES = `
	MATCH (m:Movie {id: $id})
	SET m.title = CASE WHEN $title IS NOT NULL THEN $title ELSE m.title END,
		m.TMDBId = CASE WHEN $TMDBId IS NOT NULL THEN $TMDBId ELSE m.TMDBId END,
		m.overview = CASE WHEN $overview IS NOT NULL THEN $overview ELSE m.overview END,
		m.popularity = CASE WHEN $popularity IS NOT NULL THEN $popularity ELSE m.popularity END,
		m.release_date = CASE WHEN $release_date IS NOT NULL THEN $release_date ELSE m.release_date END,
		m.poster_path = CASE WHEN $poster_path IS NOT NULL THEN $poster_path ELSE m.poster_path END,
		m.adult = CASE WHEN $adult IS NOT NULL THEN $adult ELSE m.adult END,
		m.backdrop_path = CASE WHEN $backdrop_path IS NOT NULL THEN $backdrop_path ELSE m.backdrop_path END,
		m.budget = CASE WHEN $budget IS NOT NULL THEN $budget ELSE m.budget END,
		m.status = CASE WHEN $status IS NOT NULL THEN $status ELSE m.status END
	RETURN m`,
	UPDATE_MOVIE_WITH_GENRES = `
	UNWIND $genres AS genreName
	MERGE (g:Genre {name: genreName})
	
	MATCH (m:Movie {id: $id})-[r:HAS_GENRE]->()
	
	SET m.title = CASE WHEN $title IS NOT NULL THEN $title ELSE m.title END,
		m.TMDBId = CASE WHEN $TMDBId IS NOT NULL THEN $TMDBId ELSE m.TMDBId END,
		m.overview = CASE WHEN $overview IS NOT NULL THEN $overview ELSE m.overview END,
		m.popularity = CASE WHEN $popularity IS NOT NULL THEN $popularity ELSE m.popularity END,
		m.release_date = CASE WHEN $release_date IS NOT NULL THEN $release_date ELSE m.release_date END,
		m.poster_path = CASE WHEN $poster_path IS NOT NULL THEN $poster_path ELSE m.poster_path END,
		m.adult = CASE WHEN $adult IS NOT NULL THEN $adult ELSE m.adult END,
		m.backdrop_path = CASE WHEN $backdrop_path IS NOT NULL THEN $backdrop_path ELSE m.backdrop_path END,
		m.budget = CASE WHEN $budget IS NOT NULL THEN $budget ELSE m.budget END,
		m.status = CASE WHEN $status IS NOT NULL THEN $status ELSE m.status END
	
	WITH m, g
	MATCH (m)-[r:HAS_GENRE]->()
	DELETE r
	
	WITH m, g
	MERGE (m)-[:HAS_GENRE]->(g)
	RETURN m, g`,
	DELETE_MOVIE = `
	MATCH (m:Movie {id: $id})
	DETACH DELETE m`,
}
export default EMovieQueries;
