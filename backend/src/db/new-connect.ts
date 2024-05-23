import neo4j from "neo4j-driver";

const NEO4J_URI = process.env.NEO4J_URI || "neo4j://localhost";

const driver = neo4j.driver(
	NEO4J_URI,
	neo4j.auth.basic("neo4j", "example"),
);
try {
	const serverInfo = await driver.getServerInfo();
	console.log("Connected to db!");
} catch (err) {
	console.log(err);
}

export default driver;
