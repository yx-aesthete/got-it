import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

dotenv.config();
const uri = process.env.CONNECT_STRING;

if (!uri) {
  throw new Error(
    "MongoDB connection string is not defined in environment variables"
  );
}
async function withMongoDB(uri, dbName, callback, leaveOpen = false) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db(dbName);
    return await callback(database);
  } catch (error) {
    console.error("MongoDB error:", error);
    throw error;
  } finally {
    if (!leaveOpen) {
      await client.close();
    }
  }
}

async function addQuestionByIdToTopic(className, topicName, questionId) {
  return await withMongoDB(uri, "gotit", async (database) => {
    const topicsCollection = database.collection("classes");

    const questionObject = {
      questionId: questionId,
      answers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };

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

    return result;
  });
}

// Function to vote on a specific question by its ObjectId
async function voteOnQuestion(
  className,
  topicName,
  questionId,
  answerIndex,
  userId
) {
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
    return await withMongoDB(uri, "gotit", async (database) => {
      // Use dynamic field name in the update operation
      const updateField = `topics.$[topic].questions.$[question].answers.${answerIndex}`;
      const topicsCollection = database.collection("classes"); // Replace with your collection name
      const usersCollection = database.collection("students"); // Replace with your users collection name
      const questionsCollection = database.collection("questions"); // Replace with your questions collection name

      const questionDoc = await questionsCollection.findOne({
        _id: new ObjectId(questionId),
      });
      if (!questionDoc) {
        console.log("Question not found.");
        return;
      }
      const questionText = questionDoc.question;

      // Update the specific answer in the answers array for the question with the given questionId
      const result = await topicsCollection.updateOne(
        {
          class_name: className,
          "topics.topic_name": topicName,
          "topics.questions.questionId": new ObjectId(Number(questionId)), // Match the question by its ID
        },
        {
          $inc: { [updateField]: 1 }, // Use bracket notation for dynamic field name
        },
        {
          arrayFilters: [
            { "topic.topic_name": topicName }, // Filter for the correct topic
            { "question.questionId": new ObjectId(Number(questionId)) }, // Filter for the correct question by ID
          ],
        }
      );

      if (result.matchedCount > 0) {
        console.log(`Vote added successfully to answer index ${answerIndex}.`);
      } else {
        console.log("Class, topic, or question not found.");
      }

      if (result.matchedCount > 0) {
        console.log(`Vote added successfully to answer index ${answerIndex}.`);

        const userUpdateResult = await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $push: {
              answers: {
                class_name: className,
                question: questionText,
                topic_name: topicName,
                vote: answerIndex,
              },
            },
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
    });
  } catch (error) {
    console.error("Error voting on question:", error);
  }
}
// voteOnQuestion('Mathematics', 'Calculus', '66f839bdbfef096374e15ee0', 3, '66f886397dce0b4ff99562aa');

async function getAllQuestions() {
  return await withMongoDB(uri, "gotit", async (database) => {
    const questionsCollection = database.collection("questions");

    const questions = await questionsCollection.find({}).toArray();

    console.log(questions);
    return questions;
  });
}

async function incrementCurrentTopicInDatabase(classId) {
  return await withMongoDB(uri, "gotit", async (database) => {
    const classesCollection = database.collection("classes");

    const result = await classesCollection.updateOne(
      { _id: new ObjectId(classId) },
      { $inc: { cur_topic: 1 } }
    );

    if (result.matchedCount > 0) {
      console.log("cur_topic incremented successfully.");
    } else {
      console.log("Class not found.");
    }

    return result;
  });
}

async function getAllClasses() {
  return await withMongoDB(uri, "gotit", async (database) => {
    const classesCollection = database.collection("classes");

    const classObjects = await classesCollection.find({}).toArray();

    console.log(classObjects);
    return classObjects;
  });
}

async function createClass(className) {
  return await withMongoDB(uri, "gotit", async (database) => {
    const classesCollection = database.collection("classes");

    const newClass = {
      class_name: className,
      topics: [],
      cur_topic: 0,
    };

    const result = await classesCollection.insertOne(newClass);

    return result;
  });
}

async function addTopicToClass(className, topicName) {
  return await withMongoDB(uri, "gotit", async (database) => {
    const classesCollection = database.collection("classes");

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
  });
}

export {
  addQuestionByIdToTopic,
  voteOnQuestion,
  getAllQuestions,
  incrementCurrentTopicInDatabase,
  getAllClasses,
  addTopicToClass,
  createClass,
  withMongoDB,
};
