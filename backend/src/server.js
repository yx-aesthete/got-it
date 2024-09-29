// @ts-ignore
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
// @ts-ignore
import { MongoClient, ObjectId } from "mongodb"; // Assuming MongoDB setup is already present
import dotenv from "dotenv";

// Import functions from your database module
import {
  incrementCurrentTopicInDatabase,
  addQuestionByIdToTopic,
  getAllClasses,
  getAllQuestions,
  voteOnQuestion,
  withMongoDB,
} from "./db.js";


// @ts-ignore
const PORT = 8080;

// @ts-ignore

dotenv.config();


const app = express();
// @ts-ignore
const server = http.createServer(app);
// @ts-ignore
const uri = process.env.CONNECT_STRING;

// Set up CORS for Express routes
// @ts-ignore
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"],
  })
);

// @ts-ignore
app.use(express.json());

// Initialize the Socket.IO server with CORS support
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow connections from this origin
    methods: ["GET", "POST"],
    credentials: true, // Allows cookies and authentication headers
  },
});


// Start the server
server.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});

// Socket.IO event listeners
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // When a student joins a class, join them to a room
  socket.on("joinClass", async (data) => {
    const { classId } = data;
    socket.join(`class_${classId}`);
    console.log(`Client joined class with ID: ${classId}`);

    // Example: Fetch the current topic from MongoDB and send it to the client
    withMongoDB(uri, "gotit", async (database) => {
      const classesCollection = database.collection("classes");
      const classDoc = await classesCollection.findOne({
        _id: new ObjectId(Number(classId)),
      });

      if (classDoc) {
        socket.emit("currentTopic", { currentTopic: classDoc.cur_topic });
      }
    });
    // @ts-ignore

  });


  // Handle student voting
  socket.on("voteOnQuestion", async (data) => {
    const { className, topicName, questionId, answerIndex } = data;

    try {
      await voteOnQuestion(className, topicName, questionId, answerIndex);
      console.log(
        `Vote recorded for question ${questionId}, answer index: ${answerIndex}`
      );

      // Emit an acknowledgment to the student
      socket.emit("voteAcknowledged", { success: true });

      // Optionally, broadcast the updated vote count or results to all students in the class
      io.to(`class_${data.classId}`).emit("voteUpdate", {
        questionId,
        answerIndex,
      });
    } catch (error) {
      console.error("Error recording vote:", error);
      socket.emit("voteAcknowledged", { success: false, error: error.message });
    }
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  });
});



app.post("/incrementCurrentTopic", (req, res) => {
  const classId = req.body.classId;

  incrementCurrentTopicInDatabase(classId)
    .then((newTopicIndex) => {
      io.to(`class_${classId}`).emit("topicUpdated", { newTopicIndex });
      res.status(200).send({ success: true, newTopicIndex });
    })
    .catch((err) => {
      res.status(500).send({ success: false, error: err.message });
    });
});

// @ts-ignore
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

// new method to get questions by class name
// @ts-ignore
app.get("/getQuestionsByClass", async (req, res) => {
  const className = req.query.className;

  try {
    // @ts-ignore
    const questions = await getAllQuestions(className);
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions by class:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch questions" });
  }
});

// @ts-ignore
app.get("/getAllQuestions", async (req, res) => {

  try {
    // @ts-ignore
    const questions = await getAllQuestions();
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions by class:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch questions" });
  }
});

// @ts-ignore
app.get("/getAllClasses", async (req, res) => {
  try {
    const classes = await getAllClasses();
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

