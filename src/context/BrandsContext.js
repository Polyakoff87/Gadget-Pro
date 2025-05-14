import React, { createContext, useContext } from "react";
import { useGetBrandsQuery } from "../api/rtkApi";

const BrandsContext = createContext();

export const useBrandContext = () => {
  return useContext(BrandsContext);
};

export const BrandsProvider = ({ children }) => {
  const { data: dataBrands, isLoading, error } = useGetBrandsQuery();

  if (isLoading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>Error loading brand data. Please try again later.</p>;
  }

  const brands = dataBrands;

  return (
    <BrandsContext.Provider value={{ brands }}>
      {children}
    </BrandsContext.Provider>
  );
};
