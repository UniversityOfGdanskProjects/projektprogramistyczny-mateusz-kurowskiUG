enum EUsersQueries {
	CREATE_USER = `CREATE (n:User {id:$id, password:$password, email:$email, role:$role})
		RETURN n`,
	GET_USERS = "MATCH(n:User) RETURN n",
	GET_USER_BY_EMAIL = "MATCH (n:User {email: $email}) RETURN n",
	DOES_USER_EXIST = `
	MATCH (n:User {email: $email}) RETURN COUNT(n) > 0 AS userExists`,
	DELETE_USER = `
	MATCH (n:User {id: $id})
	DETACH DELETE n
	RETURN n
	`,
}

export default EUsersQueries;
