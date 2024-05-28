import app from "./api";
import driver from "./db/new-connect";
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
	console.log(`Example app listening on port ${PORT}`);
	const session = driver.session();
});
