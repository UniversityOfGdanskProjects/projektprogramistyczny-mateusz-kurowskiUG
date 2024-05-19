import type { SchemaObject } from "neode";

const genreSchema: SchemaObject = {
	id: {
		type: "uuid",
		primary: true,
	},
	name: {
		type: "string",
		required: true,
	},
	TMDBId: {
		type: "integer",
		required: true,
		unique: true,
	},
	genre: {
		type: "nodes",
		target: "Movie",
		direction: "in",
		relationship: "GENRE",
		properties: {
			date: "datetime",
		},
		cascade: "detach",
		eager: true,
	},
};
export default genreSchema;
