import { createContext } from "react";
import UserInterface from "../../interfaces/User.model";
import MovieInterface from "../../interfaces/Movie.model";

type TLoginContext = {
  loggedIn: boolean;
  theme: string;
  wantToLogin: boolean;
  user: UserInterface | null;
  setUser: (user: UserInterface) => void;
  setWantToLogin: (wantToLogin: boolean) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  handleLogout: (e) => void;
  handleSearch: (search: string) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  searchResults: MovieInterface[];
  setSearchResults: (searchResults: MovieInterface[]) => void;
};

const loginContext = createContext<TLoginContext>({
  loggedIn: true,
  theme: "dark",
  wantToLogin: false,
  user: null,
  setUser: (): void => {},
  setWantToLogin: (): void => {},
  setLoggedIn: (): void => {},
  handleLogout: (): void => {},
  handleSearch: (): void => {},
  searchTerm: "",
  setSearchTerm: (): void => {},
  searchResults: [],
  setSearchResults: () => {},
});
export default loginContext;
