import { createContext, useContext } from "react";
import { useGetCurrentUserQuery } from "../api/rtkApi";

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const { data: currentUser, isLoading, error } = useGetCurrentUserQuery();

  if (isLoading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>Error loading user data. Please try again later.</p>;
  }

  const userId = currentUser?.id;

  return (
    <UserContext.Provider value={{ userId }}>{children}</UserContext.Provider>
  );
};
