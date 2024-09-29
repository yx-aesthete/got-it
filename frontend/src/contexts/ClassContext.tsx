import React, { createContext, useContext, useState } from "react";

interface ClassContextType {
  isEditing: boolean;
  isPresenting: boolean;
  activeClass: string | null;
  handleEdit: () => void;
  handlePresent: () => void;
  setActiveClassWrapper: (name: string | undefined) => void;
}

export const ClassContext = createContext<ClassContextType | undefined>(
  undefined
);

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  console.log("🚀 ~ isEditing:", isEditing);
  const [isPresenting, setIsPresenting] = useState(false);
  console.log("🚀 ~ isPresenting:", isPresenting);
  const [activeClass, setActiveClass] = useState<string | null>(null);
  console.log("🚀 ~ activeClass:", activeClass);

  // Function to handle editing the active class
  const handleEdit = () => {
    if (activeClass && !isPresenting) {
      setIsEditing((prev) => !prev);
    }
  };

  // Function to toggle presenting the active class
  const handlePresent = () => {
    if (activeClass && !isEditing) {
      setIsPresenting((prev) => !prev);
    }
  };

  // Function to set the active class
  const setActiveClassWrapper = (name: string | undefined) => {
    if (!isEditing && !isPresenting) {
      console.log("name", name);
      setActiveClass(name ?? null);
      // Reset editing and presenting states when a new class is activated
      setIsEditing(false);
      setIsPresenting(false);
    }
  };

  return (
    <ClassContext.Provider
      value={{
        isEditing,
        isPresenting,
        activeClass,
        handleEdit,
        handlePresent,
        setActiveClassWrapper,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

// Custom hook to use the ClassContext
export const useClassContext = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClassContext must be used within a ClassProvider");
  }
  return context;
};
