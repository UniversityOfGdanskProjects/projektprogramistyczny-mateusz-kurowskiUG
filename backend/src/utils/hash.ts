import bcrypt from "bcrypt";
const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> =>
	await bcrypt.hash(password, saltRounds);

export const comparePassword = async (password: string, hash: string) => 
	 await bcrypt.compare(password, hash);

