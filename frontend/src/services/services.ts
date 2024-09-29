import axios from "axios";
import { io } from "socket.io-client";

// Initialize WebSocket connection
// const socket = io("http://got-it.onrender.com");
const socket = io("http://localhost:8080");

// API endpoint base URL
const API_BASE_URL = "http://localhost:8080";

// Socket Events
export const joinClass = (classId: any) => {
  socket.emit("joinClass", { classId });
};

export const listenToCurrentTopic = (callback: any) => {
  socket.on("currentTopic", callback);
};

export const listenToTopicChanges = (callback: any) => {
  socket.on("curTopicChanged", callback);
};

export const voteOnQuestionSocket = (
  className: any,
  topicName: any,
  questionId: any,
  answerIndex: any
) => {
  socket.emit("voteOnQuestion", {
    className,
    topicName,
    questionId,
    answerIndex,
  });
};

// REST API Calls using Axios
export const getAllQuestions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllQuestions`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch questions.");
  }
};

export const getAllClasses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllClasses`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch classes.");
  }
};

export const incrementCurrentTopic = async (classId: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/incrementCurrentTopic`, {
      classId,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to increment current topic.");
  }
};

export const addQuestionToTopic = async (
  className: any,
  topicName: any,
  questionId: any
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/addQuestionByIdToTopic`,
      {
        className,
        topicName,
        questionId,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to add question to topic.");
  }
};
