import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getAllQuestions, getAllClasses, joinClass, listenToCurrentTopic, listenToTopicChanges } from "../services/services";


// Define the shape of your context
interface DataContextType {
  questions: any[];
  classes: any[];
  currentTopic: string | null;
  isLoading: boolean;
  isError: boolean;
  fetchQuestions: () => void;
  fetchClasses: () => void;
  handleJoinClass: (classId: string) => void;
}

// Create a default value for the context
const defaultValue: DataContextType = {
  questions: [],
  classes: [],
  currentTopic: null,
  isLoading: false,
  isError: false,
  fetchQuestions: () => {},
  fetchClasses: () => {},
  handleJoinClass: () => {},
};

// Create the context with the default value
const DataContext = createContext<DataContextType>(defaultValue);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch all questions
  const fetchQuestions = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getAllQuestions();
      setQuestions(data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all classes
  const fetchClasses = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getAllClasses();
      setClasses(data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle joining a class
  const handleJoinClass = (classId: string) => {
    joinClass(classId);
  };

  // Listen for current topic updates
  useEffect(() => {
    listenToCurrentTopic((data: { currentTopic: React.SetStateAction<string | null>; }) => {
      setCurrentTopic(data.currentTopic);
    });

    listenToTopicChanges((data: { newCurTopic: React.SetStateAction<string | null>; }) => {
      setCurrentTopic(data.newCurTopic);
    });
  }, []);

  return (
    <DataContext.Provider
      value={{
        questions,
        classes,
        currentTopic,
        isLoading,
        isError,
        fetchQuestions,
        fetchClasses,
        handleJoinClass,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
