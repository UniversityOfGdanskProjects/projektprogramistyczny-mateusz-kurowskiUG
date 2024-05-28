import { createContext } from "react";

type TForm = { status: string; setStatus: (status: string) => void };
export const formContext = createContext<TForm>({
  status: "",
  setStatus: (status: string) => {},
});
