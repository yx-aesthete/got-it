import React, { createContext, useContext, useState } from "react";

interface ClassContextType {
  isEditing: boolean;
  isPresenting: boolean;
  presentingName: string;
  activeClass: string | null;
  handleEdit: () => void;
  handlePresent: () => void; // Accept a name parameter
  setActiveClassWrapper: (name: string | undefined) => void;
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
  const [presentingName, setPresentingName] = useState<string>("");

  // Function to handle editing the active class
  const handleEdit = () => {
    if (activeClass && !isPresenting) {
      setIsEditing((prev) => !prev);
    }
  };

  // Function to toggle presenting the active class
  const handlePresent = () => {
    // Accepts a name parameter
    if (activeClass && !isEditing) {
      setIsPresenting((prev) => !prev);
      if (!isPresenting) {
        setPresentingName(activeClass); // Set the presenting name when starting
      } else {
        setPresentingName(""); // Clear presenting name when stopping
        setActiveClass(null); // Optionally clear active class when not presenting
      }
    }
  };

  // Function to set the active class
  const setActiveClassWrapper = (name: string | undefined) => {
    if (!isEditing && !isPresenting) {
      setActiveClass(name ?? null);
      // Reset editing and presenting states when a new class is activated
      setIsEditing(false);
      setIsPresenting(false);
      setPresentingName(""); // Clear presenting name if not presenting
    }
  };

  return (
    <ClassContext.Provider
      value={{
        isEditing,
        isPresenting,
        activeClass,
        presentingName,
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
