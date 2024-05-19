import type { SchemaObject } from "neode";

const castSchema: SchemaObject = {
	id: {
		type: "uuid",
		primary: true,
		unique: true,
	},
	tmdbId: {
		type: "integer",
		unique: true,
	},
	name: {
		type: "string",
	},
	popularity: {
		type: "number",
	},
	profile_path: {
		type: "string",
	},
	cast: {
		type: "relationship",
		target: "Movie",
		relationship: "CAST",
		direction: "out",
		properties: {
			character: "string",
		},
		cascade: "detach",
		eager: true,
	},
};
export default castSchema;
