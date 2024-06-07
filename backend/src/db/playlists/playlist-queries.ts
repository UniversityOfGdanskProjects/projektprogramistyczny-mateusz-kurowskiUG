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
    (m:Movie {id: $add})
    CREATE (p)-[:CONTAINS]->(m)
    return p
    `,
  DELETE_FROM_PLAYLIST = `
    MATCH (p:Playlist {id: $playlistId})-[r:CONTAINS]->(m:Movie {id: $remove})
    DELETE r
    return p
    `,
  CREATE_PLAYLIST = `
  WITH datetime().epochMillis as datetime
  WITH apoc.date.format(datetime, "ms", "yyyy-MM-dd'T'HH:mm:ssz") AS time
    MATCH (u:User {id: $userId})
    CREATE (u)-[:CREATED]->(p:Playlist {id: $playlistId, name: $name, createdAt: time, updatedAt: time})
    RETURN p
    `,
  DELETE_PLAYLIST = `
    MATCH (p:Playlist {id: $playlistId})
    DETACH DELETE p
    `,
  RENAME_PLAYLIST = `
  MATCH (p:Playlist {id: $playlistId})
  SET p.name=$name
    RETURN p
  `,
}
export default EPlaylistQueries;
