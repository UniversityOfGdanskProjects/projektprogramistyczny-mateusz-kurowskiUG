import neo4j from "neo4j-driver";

const driver = neo4j.driver(
	"neo4j://localhost",
	neo4j.auth.basic("neo4j", "example"),
);
try {
	const serverInfo = await driver.getServerInfo();
	console.log("Connected to db!");
} catch (err) {
	console.log(err);
}

export default driver;
