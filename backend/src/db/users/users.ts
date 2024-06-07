import {
	EDBMessage,
	type IUserDeletionResponse,
	type IUserCreationResponse,
} from "../../interfaces/TDBResponse";
import type INewUser from "../../interfaces/user/INewUser";
import type IUser from "../../interfaces/user/IUser";
import { hashPassword } from "../../utils/hash";
import driver from "../new-connect";
import EUsersQueries from "./usersQueries";

const getUsers = async (): Promise<IUser[]> => {
	const { records } = await driver.executeQuery(EUsersQueries.GET_USERS);
	const users = records.map(
		// biome-ignore lint/complexity/useLiteralKeys: field is private
		(record) => record.toObject()["n"]["properties"] as IUser,
	);
	return users;
};

const doesUserExist = async (email: string): Promise<boolean> => {
	const { records } = await driver.executeQuery(EUsersQueries.DOES_USER_EXIST, {
		email,
	});
	const exists = records.map(
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		(record) => record.toObject()["userExists"] as boolean,
	)[0];
	if (exists) return true;
	return false;
};

const createUser = async (user: INewUser): Promise<IUserCreationResponse> => {
	try {
		const hashedPassword = await hashPassword(user.password);
		const newUser: INewUser = {
			...user,
			password: hashedPassword,
		};
		const { records } = await driver.executeQuery(
			EUsersQueries.CREATE_USER,
			newUser,
		);
		const createdUser = records.map(
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			(record) => record.toObject()["n"]["properties"] as IUser,
		)[0];
		return {
			result: true,
			msg: EDBMessage.USER_CREATED,
			data: createdUser,
		};
		// const user = AdminDB.get
	} catch (e) {
		console.log(e);

		return { result: false, msg: EDBMessage.USER_NOT_CREATED, data: undefined };
	}
};

const deleteUser = async (id: string): Promise<IUserDeletionResponse> => {
	try {
		const { records } = await driver.executeQuery(EUsersQueries.DELETE_USER, {
			id,
		});
		const deletedUser = records.map(
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			(record) => record.toObject()["n"]["properties"] as IUser,
		)[0];
		if (!deletedUser)
			return {
				result: false,
				msg: EDBMessage.USER_NOT_DELETED,
				data: undefined,
			};

		return {
			result: true,
			msg: EDBMessage.USER_DELETED,
			data: undefined,
		};
	} catch (e) {
		return { result: false, msg: EDBMessage.USER_NOT_DELETED, data: undefined };
	}
};

const getUserById = async (id: string): Promise<IUser> => {
	const { records } = await driver.executeQuery(EUsersQueries.GET_USER_BY_ID, {
		id,
	});
	const user = records.map(
		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
		(record) => record.toObject()["n"]["properties"] as IUser,
	)[0];
	return user;
};

const UsersDB = {
	createUser,
	getUsers,
	doesUserExist,
	deleteUser,
	getUserById,
};
export default UsersDB;
