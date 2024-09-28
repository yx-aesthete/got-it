import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.CONNECT_STRING;

if (!uri) {
  throw new Error("MongoDB connection string is not defined in environment variables");
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Function to add a question to a topic
async function addQuestionToTopic(className, topicName, questionText) {
  try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Specify the database and collection
      const database = client.db('gotit'); // Replace with your database name
      const collection = database.collection('classes'); // Replace with your collection name

      const questionObject = {
        question: questionText,
        answers: [0, 0, 0, 0, 0]  // List of 5 integers
      };


      // Find the document by class_name and topic_name, then push the question to the topic's questions array
      const result = await collection.updateOne(
          {
              class_name: className,
              'topics.topic_name': topicName
          },
          {
              $push: { 'topics.$.questions': questionObject }
          }
      );

      if (result.matchedCount > 0) {
          console.log('Question added successfully.');
      } else {
          console.log('Class or topic not found.');
      }
  } catch (error) {
      console.error('Error adding question:', error);
  } finally {
      // Ensure the client will close when you finish/error
      await client.close();
  }
}

async function voteOnQuestion(className, topicName, questionText, answerIndex) {
  if (answerIndex < 0 || answerIndex > 4) {
    console.log('Invalid answer index. It must be between 0 and 4.');
    return;
  }

  try {
    await client.connect();

    const database = client.db('gotit'); // Replace with your database name
    const collection = database.collection('classes'); // Replace with your collection name

    const result = await collection.updateOne(
      {
        class_name: className,
        'topics.topic_name': topicName,
        'topics.questions.question': questionText
      },
      {
        $inc: { [`topics.$[topic].questions.$[question].answers.${answerIndex}`]: 1 }
      },
      {
        arrayFilters: [
          { 'topic.topic_name': topicName }, 
          { 'question.question': questionText }
        ]
      }
    );

    if (result.matchedCount > 0) {
      console.log(`Vote added successfully to answer index ${answerIndex}.`);
    } else {
      console.log('Class, topic, or question not found.');
    }
  } catch (error) {
    console.error('Error voting on question:', error);
  } finally {
    await client.close();
  }
}

// Example usage:
// addQuestionToTopic('Mathematics', 'Calculus', 'What is the derivative of sin(x)?');
// voteOnQuestion('Mathematics', 'Calculus', 'What is the derivative of sin(x)?', 2);

async function getAllQuestions() {
  try {
    await client.connect();

    const database = client.db('gotit'); // Replace with your database name
    const collection = database.collection('questions'); // Replace with your collection name

    // Fetch all questions from the collection
    const questions = await collection.find({}, { projection: { _id: 1, question: 1 } }).toArray();

    if (questions.length > 0) {
      console.log('Questions found:', questions);
    } else {
      console.log('No questions found.');
    }

    return questions; // Return the array of questions
  } catch (error) {
    console.error('Error retrieving questions:', error);
    return [];
  } finally {
    await client.close();
  }
}

// Example usage:
getAllQuestions()
