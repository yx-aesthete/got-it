import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  getAllQuestions,
  getAllClasses,
  joinClass,
  listenToCurrentTopic,
  listenToTopicChanges,
} from "../services/services";

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

const DataContext = createContext<DataContextType>(defaultValue);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  console.log("🚀 ~ DataProvider ~ questions:", questions);
  const [classes, setClasses] = useState<any[]>([]);
  console.log("🚀 ~ DataProvider ~ classes:", classes);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  console.log("🚀 ~ DataProvider ~ currentTopic:", currentTopic);
  const [isLoading, setIsLoading] = useState(false);
  console.log("🚀 ~ DataProvider ~ isLoading:", isLoading);
  const [isError, setIsError] = useState(false);

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

  const handleJoinClass = (classId: string) => {
    joinClass(classId);
  };

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ DataProvider");
    listenToCurrentTopic(
      (data: { currentTopic: React.SetStateAction<string | null> }) => {
        setCurrentTopic(data.currentTopic);
      }
    );

    listenToTopicChanges(
      (data: { newCurTopic: React.SetStateAction<string | null> }) => {
        setCurrentTopic(data.newCurTopic);
      }
    );

    // Fetch questions and classes when the component mounts
    fetchQuestions();
    fetchClasses();
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
