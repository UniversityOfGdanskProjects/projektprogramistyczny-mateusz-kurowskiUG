enum EPlaylistQueries {
	GET_PLAYLISTS_BY_USERID = `
    MATCH (u:User {id: $userId})-[:CREATED]->(p:Playlist)
    RETURN p
    `,
	GET_PLAYLIST_BY_ID = `
    MATCH (p:Playlist {id: $playlistId})
    RETURN p
    `,
	ADD_TO_PLAYLIST = `
    MATCH (p:Playlist {id: $playlistId}),
    (m:Movie {id: $movieId})
    CREATE (p)-[:CONTAINS]->(m)
    `,
	DELETE_FROM_PLAYLIST = `
    MATCH (p:Playlist {id: $playlistId})-[r:CONTAINS]->(m:Movie {id: $movieId})
    DELETE r
    `,
	// UPDATE_PLAYLIST = `
	// MATCH (p:Playlist {id: $playlistId})
	// `,
}
export default EPlaylistQueries;
