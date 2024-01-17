import { createContext } from "react";
import UserInterface from "../../interfaces/User.model";

type TLoginContext = {
  loggedIn: boolean;
  theme: string;
  wantToLogin: boolean;
  user: UserInterface | null;
  setUser: (user: UserInterface) => void;
  setWantToLogin: (wantToLogin: boolean) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  handleLogout: (loggedIn: boolean) => void;
  handleSearch: (search: string) => void;

};

const loginContext = createContext<TLoginContext>({
  loggedIn: false,
  theme: "dark",
  wantToLogin: false,
  user: null,
  setUser: (): void => {},
  setWantToLogin: (): void => {},
  setLoggedIn: (): void => {},
  handleLogout: (): void => {},
  handleSearch: (): void => {},
});
export default loginContext;
