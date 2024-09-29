import express from "express";
import http from "http";
import { Server } from "socket.io";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import {
  incrementCurrentTopicInDatabase,
  addQuestionByIdToTopic,
  getAllClasses,
  getAllQuestions,
  voteOnQuestion,
  withMongoDB,
} from "./db.js";

const PORT = 8080;

const uri = process.env.CONNECT_STRING;
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for CORS
    methods: ["GET", "POST"],
  },
});

server.listen(PORT, () => {
  console.log("Server is running on http://localhost:8080");
});

app.post("/incrementCurrentTopic", (req, res) => {
  const classId = req.body.classId;

  incrementCurrentTopicInDatabase(classId)
    .then((newTopicIndex) => {
      // Emit WebSocket event to students in this class
      io.to(`class_${classId}`).emit("topicUpdated", { newTopicIndex });

      res.status(200).send({ success: true, newTopicIndex });
    })
    .catch((err) => {
      res.status(500).send({ success: false, error: err.message });
    });
});

app.post("/addQuestionByIdToTopic", async (req, res) => {
  const { className, topicName, questionId } = req.body;

  // Basic validation
  if (!className || !topicName || !questionId) {
    return res
      .status(400)
      .json({ error: "className, topicName, and questionId are required" });
  }

  try {
    // Call your existing addQuestionByIdToTopic function
    await addQuestionByIdToTopic(className, topicName, questionId);

    // Respond with success
    res.status(200).json({
      success: true,
      message: `Question added to topic ${topicName} in class ${className}`,
    });
  } catch (error) {
    console.error("Error adding question to topic:", error);
    res.status(500).json({ error: "Failed to add question to topic" });
  }
});

// Assuming you have Express, MongoClient, and other required dependencies already set up as in the previous code

// Implement the endpoint for getting all questions
app.get("/getAllQuestions", async (req, res) => {
  try {
    // Call the function that retrieves all questions from the database
    const questions = await getAllQuestions();
    // Send the questions back as JSON
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching all questions:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch questions" });
  }
});

// Implement the endpoint for getting all classes
app.get("/getAllClasses", async (req, res) => {
  try {
    // Call the function that retrieves all classes from the database
    const classes = await getAllClasses();
    // Send the classes back as JSON
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching all classes:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch classes" });
  }
});

io.on("connection", (socket) => {
  console.log("A client connected");

  // When a student joins a class, join them to a room
  socket.on("joinClass", async (data) => {
    const { classId } = data;
    socket.join(`class_${classId}`);
    console.log(`Client joined class with ID: ${classId}`);

    // Send the current topic to the newly connected client

    await withMongoDB(uri, "gotit", async (database) => {
      const classesCollection = database.collection("classes");
      const classDoc = await classesCollection.findOne({
        _id: new ObjectId(Number(classId)),
      });
      if (classDoc) {
        socket.emit("currentTopic", { currentTopic: classDoc.cur_topic });
      }
    });
  });

  // Handle student voting
  socket.on("voteOnQuestion", async (data) => {
    const { className, topicName, questionId, answerIndex } = data;

    try {
      // Call your existing voteOnQuestion function to handle the vote
      await voteOnQuestion(className, topicName, questionId, answerIndex);
      console.log(
        `Vote recorded: class=${className}, topic=${topicName}, question=${questionId}, answer=${answerIndex}`
      );

      // Optionally, you can emit an acknowledgment to the student
      socket.emit("voteAcknowledged", { success: true });

      // You might also want to broadcast the updated vote count or results to all students in the class
      // io.to(`class_${classId}`).emit("voteUpdate", { ...updatedVoteData });
    } catch (error) {
      console.error("Error recording vote:", error);
      socket.emit("voteAcknowledged", { success: false, error: error.message });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

app.post("/start-voting", express.json(), async (req, res) => {
  const { classId, topicName } = req.body;

  if (!classId || !topicName) {
    return res
      .status(400)
      .json({ error: "classId and topicName are required." });
  }

  try {
    // Broadcast the startVoting signal to all clients in the class
    io.to(`class_${classId}`).emit("startVoting", { topicName });
    console.log(
      `Lecturer started voting for class ${classId} on topic ${topicName}`
    );
    res.json({
      success: true,
      message: `Voting started for class ${classId} on topic ${topicName}`,
    });
  } catch (error) {
    console.error("Error starting voting:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to start voting." });
  }
});

app.get("/current-votes/:className", async (req, res) => {
  const { className } = req.params;

  try {
    await withMongoDB(uri, "gotit", async (database) => {
      const votesCollection = database.collection("votes");
      const votes = await votesCollection.find({ className }).toArray();
      res.json(votes);
    });
  } catch (error) {
    res.status(500).send("Error fetching votes");
  }
});
