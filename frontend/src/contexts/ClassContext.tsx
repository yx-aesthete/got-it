import React, { createContext, useContext, useState } from "react";

interface ClassContextType {
  isEditing: boolean;
  isPresenting: boolean;
  activeClass: string | null;
  handleEdit: () => void;
  handlePresent: () => void;
  setActiveClass: (name: string) => void;
}

export const ClassContext = createContext<ClassContextType | undefined>(
  undefined
);

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [activeClass, setActiveClass] = useState<string | null>(null);

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
  const setActiveClassWrapper = (name: string) => {
    setActiveClass(name);
    // Reset editing and presenting states when a new class is activated
    setIsEditing(false);
    setIsPresenting(false);
  };

  return (
    <ClassContext.Provider
      value={{
        isEditing,
        isPresenting,
        activeClass,
        handleEdit,
        handlePresent,
        setActiveClass: setActiveClassWrapper,
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
