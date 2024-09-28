import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const uri = process.env.CONNECT_STRING;

if (!uri) {
  throw new Error('MongoDB connection string is not defined in environment variables');
}

const client = new MongoClient(uri, { useUnifiedTopology: true });

async function watchCurTopicForClass(classId) {
  try {
    await client.connect();
    const database = client.db('gotit'); // Replace with your database name
    const classesCollection = database.collection('classes'); // Replace with your collection name

    // Watch for changes in the "cur_topic" field for a specific class ID
    const changeStream = classesCollection.watch([
      {
        $match: {
          'documentKey._id': new ObjectId(classId), // Only follow changes for the specific class ID
          'updateDescription.updatedFields.cur_topic': { $exists: true }
        }
      }
    ]);

    changeStream.on('change', (change) => {
      console.log('Change detected for class ID:', classId);
      const newCurTopic = change.updateDescription.updatedFields.cur_topic;

      // Emit the cur_topic change to connected clients
      io.emit('curTopicChanged', { classId: classId, newCurTopic });
    });
  } catch (error) {
    console.error('Error watching cur_topic changes for class:', error);
  }
}
