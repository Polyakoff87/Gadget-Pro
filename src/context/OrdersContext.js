import { createContext, useContext } from "react";
import { useGetUserOrdersQuery } from "../api/rtkApi";
import { useUserContext } from "./UserContext";

const OrdersContext = createContext();

export const useOrdersContext = () => {
  return useContext(OrdersContext);
};

export const OrdersProvider = ({ children }) => {
  const { userId } = useUserContext();
  const {
    data: userOrders = [],
    isLoading,
    error,
  } = useGetUserOrdersQuery(userId, {
    skip: !userId,
  });

  return (
    <OrdersContext.Provider value={{ userOrders, isLoading, error }}>
      {children}
    </OrdersContext.Provider>
  );
};
