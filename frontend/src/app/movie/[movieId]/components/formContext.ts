import { createContext } from "react";

type TForm = { status: string };
export const formContext = createContext<TForm>({ status: "" });
