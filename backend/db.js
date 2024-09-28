dotenv.config();
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

const uri = process.env.CONNECT_STRING;

if (!uri) {
  throw new Error(
    "MongoDB connection string is not defined in environment variables"
  );
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Function to add a question to a topic
async function addQuestionByIdToTopic(className, topicName, questionId) {
  try {
    await client.connect();

    const database = client.db("gotit"); // Replace with your database name
    const topicsCollection = database.collection("classes"); // Replace with your collection name

    const questionObject = {
      questionId: questionId,
      answers: [0, 0, 0, 0, 0], // List of 5 integers
    };

    // Update the topics collection by adding the question ID to the questions array
    const result = await topicsCollection.updateOne(
      {
        class_name: className,
        "topics.topic_name": topicName,
      },
      {
        $push: { "topics.$.questions": questionObject },
      }
    );

    if (result.matchedCount > 0) {
      console.log("Question ID added to the topic successfully.");
    } else {
      console.log("Class or topic not found.");
    }
  } catch (error) {
    console.error("Error adding question by ID to topic:", error);
  } finally {
    await client.close();
  }
}
// addQuestionByIdToTopic('Mathematics', 'Calculus', new ObjectId('66f839bdbfef096374e15ee0'));

// Function to vote on a specific question by its ObjectId
async function voteOnQuestion(className, topicName, questionId, answerIndex) {
  if (answerIndex < 0 || answerIndex > 4) {
    console.log("Invalid answer index. It must be between 0 and 4.");
    return;
  }

  try {
    await client.connect();

    const database = client.db("gotit"); // Replace with your database name
    const topicsCollection = database.collection("classes"); // Replace with your collection name

    // Use dynamic field name in the update operation
    const updateField = `topics.$[topic].questions.$[question].answers.${answerIndex}`;

    // Update the specific answer in the answers array for the question with the given questionId
    const result = await topicsCollection.updateOne(
      {
        class_name: className,
        "topics.topic_name": topicName,
        "topics.questions.questionId": new ObjectId(questionId), // Match the question by its ID
      },
      {
        $inc: { [updateField]: 1 }, // Use bracket notation for dynamic field name
      },
      {
        arrayFilters: [
          { "topic.topic_name": topicName }, // Filter for the correct topic
          { "question.questionId": new ObjectId(questionId) }, // Filter for the correct question by ID
        ],
      }
    );

    if (result.matchedCount > 0) {
      console.log(`Vote added successfully to answer index ${answerIndex}.`);
    } else {
      console.log("Class, topic, or question not found.");
    }
  } catch (error) {
    console.error("Error voting on question:", error);
  } finally {
    await client.close();
  }
}
// voteOnQuestion('Mathematics', 'Calculus', '66f839bdbfef096374e15ee0', 2);

async function getAllQuestions() {
  try {
    await client.connect();

    const database = client.db("gotit"); // Replace with your database name
    const collection = database.collection("questions"); // Replace with your collection name

    // Fetch all questions from the collection
    const questions = await collection
      .find({}, { projection: { _id: 1, question: 1 } })
      .toArray();

    if (questions.length > 0) {
      console.log("Questions found:", questions);
    } else {
      console.log("No questions found.");
    }

    return questions; // Return the array of questions
  } catch (error) {
    console.error("Error retrieving questions:", error);
    return [];
  } finally {
    await client.close();
  }
}
// getAllQuestions()

async function incrementCurrentTopicInDatabase(classId) {
  try {
    await client.connect();

    const database = client.db("gotit"); // Replace with your database name
    const classesCollection = database.collection("classes"); // Replace with your collection name

    // Increment the cur_topic field by 1 for the specified class
    const result = await classesCollection.updateOne(
      { _id: new ObjectId(classId) }, // Match by class ID
      { $inc: { cur_topic: 1 } } // Increment cur_topic by 1
    );

    if (result.matchedCount > 0) {
      console.log("cur_topic incremented successfully.");
    } else {
      console.log("Class not found.");
    }
  } catch (error) {
    console.error("Error incrementing cur_topic:", error);
  } finally {
    await client.close();
  }
}

// incrementCurrentTopic('66f83ab9bfef096374e15eea');

async function getAllClasses() {
  try {
    await client.connect();

    const database = client.db("gotit"); // Replace with your database name
    const classesCollection = database.collection("classes"); // Replace with your collection name

    const classObjects = await classesCollection.find({}).toArray();
    console.log(classObjects);
    return classObjects;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.close();
  }
}
// getAllClasses()

function startListeningForClassChanges() {
  const changeStream = classesCollection.watch([
    {
      $match: {
        "updateDescription.updatedFields.cur_topic": { $exists: true },
      },
    },
  ]);

  changeStream.on("change", (change) => {
    const classId = change.documentKey._id;
    const newCurTopic = change.updateDescription.updatedFields.cur_topic;

    console.log(
      "Change detected for class ID:",
      classId,
      "New cur_topic:",
      newCurTopic
    );

    // Notify all connected clients (students) about the updated topic
    io.to(`class_${classId}`).emit("curTopicChanged", {
      classId: classId.toString(),
      newCurTopic,
    });
  });

  console.log("Started watching changes for cur_topic in MongoDB");
}
async function initializeMongoAndStartServer() {
  try {
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Initialize database and collections
    db = client.db(dbName);
    classesCollection = db.collection("classes");
    questionsCollection = db.collection("questions");

    // Start listening for changes in classes collection
    startListeningForClassChanges();

    // Start the server after the connection is established
    server.listen(8080, () => {
      console.log("Server is running on http://localhost:8080");
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

export {
  addQuestionByIdToTopic,
  voteOnQuestion,
  getAllQuestions,
  incrementCurrentTopicInDatabase,
  getAllClasses,
  startChangeStreamListener,
  initializeMongoAndStartServer,
};
