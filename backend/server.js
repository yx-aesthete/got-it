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