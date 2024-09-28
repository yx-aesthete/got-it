import express from "express";
import http from "http";
import io from "socket.io";
import { incrementCurrentTopicInDatabase, addQuestionByIdToTopic } from "./db";

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

initializeMongoAndStartServer();

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

// WebSocket connection handling for students
io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("joinClass", async (data) => {
    const { classId } = data;
    socket.join(`class_${classId}`);
    console.log(`Client joined class with ID: ${classId}`);

    // Send the current topic to the newly connected client
    const classDoc = await classesCollection.findOne({
      _id: new ObjectId(classId),
    });
    if (classDoc) {
      socket.emit("currentTopic", { currentTopic: classDoc.cur_topic });
    }
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});
