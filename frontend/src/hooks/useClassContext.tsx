import { useContext } from "react";
import { ClassContext } from "../contexts/ClassContext";

// Custom hook to use the ClassContext
export const useClassContext = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClassContext must be used within a ClassProvider");
  }
  return context;
};
