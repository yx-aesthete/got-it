import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

dotenv.config();
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
      answers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // List of 10 integers
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
async function voteOnQuestion(className, topicName, questionId, answerIndex, userId) {
  if (answerIndex < 0 || answerIndex > 4) {
    console.log("Invalid answer index. It must be between 0 and 4.");
    return;
  }
  // Validate userId
  if (!ObjectId.isValid(userId)) {
    console.log("Invalid userId. It must be a 24-character hex string.");
    return;
  }

  try {
    await client.connect();

    const database = client.db("gotit"); // Replace with your database name
    const topicsCollection = database.collection("classes"); // Replace with your collection name
    const usersCollection = database.collection("students"); // Replace with your users collection name
    const questionsCollection = database.collection("questions"); // Replace with your questions collection name

    const questionDoc = await questionsCollection.findOne({ _id: new ObjectId(questionId) });
    if (!questionDoc) {
      console.log("Question not found.");
      return;
    }
    const questionText = questionDoc.question;


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
      
      
      const userUpdateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $push: {
            answers: {
              class_name: className,
              question_id: questionText,
              topic_name: topicName,
              vote: answerIndex
            }
          }
        }
      );

      if (userUpdateResult.matchedCount > 0) {
        console.log("User's answers array updated successfully.");
      } else {
        console.log("User not found.");
      }


    } else {
      console.log("Class, topic, or question not found.");
    }
  } catch (error) {
    console.error("Error voting on question:", error);
  } finally {
    await client.close();
  }
}
// voteOnQuestion('Mathematics', 'Calculus', '66f839bdbfef096374e15ee0', 3, '66f886397dce0b4ff99562aa');

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

async function startListeningForClassChanges(io) {
  const client = await MongoClient.connect(uri);
  console.log("Connected to MongoDB");

  // Initialize database and collections
  const db = client.db("gotit");
  const classesCollection = db.collection("classes");
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


async function addTopicToClass(className, topicName, topicDescription) {
  try {
    await client.connect();

    const database = client.db('gotit'); // Replace with your database name
    const classesCollection = database.collection('classes'); // Replace with your collection name

    const newTopic = {
      topic_name: topicName,
      questions: [],
      topic_description: topicDescription,
      estimated_time_minutes: 0,
    };

    const result = await classesCollection.updateOne(
      { class_name: className },
      { $push: { topics: newTopic } }
    );

    if (result.matchedCount === 0) {
      throw new Error(`Class with name ${className} not found`);
    }

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.close();
  }
}

async function createClass(className) {
  try {
    await client.connect();

    const database = client.db('gotit'); // Replace with your database name
    const classesCollection = database.collection('classes'); // Replace with your collection name

    const newClass = {
      class_name: className,
      topics: [],
      cur_topic: 0,
      is_active: true,
      description: '',
    };

    const result = await classesCollection.insertOne(newClass);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.close();
  }
}


export {
  addQuestionByIdToTopic,
  voteOnQuestion,
  getAllQuestions,
  incrementCurrentTopicInDatabase,
  getAllClasses,
  startListeningForClassChanges,
  addTopicToClass,
  createClass,
};
