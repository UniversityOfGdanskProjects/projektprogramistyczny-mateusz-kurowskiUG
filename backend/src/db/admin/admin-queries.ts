enum AdminQueries {
	getUsers = "MATCH(n:User) RETURN n",
	createMovieWithoutGenres =
	`CALL apoc.create.node(['Movie'], {
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
}

export default AdminQueries;
