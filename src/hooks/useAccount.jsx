import React from "react";
import { useSelector } from "react-redux";

const useAccount = () => {
  const { userData } = useSelector((state) => state.user);

  return userData;
};

export default useAccount;
