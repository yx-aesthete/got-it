# got-it

## setup

1. create `.env` using `env` file
2. run `npm install`
3. run `npm run start` or for debugging run via debug extension (see `launch.json`)

# Backend documentations:

# API Documentation

This documentation outlines the API endpoints and real-time communication events for your Node.js application. The application uses **Express.js** for RESTful API endpoints, **Socket.IO** for real-time communication, and **MongoDB** for data storage. It facilitates interactions between lecturers and students by managing classes, topics, questions, and votes.

---

## Table of Contents

- [API Endpoints](#api-endpoints)
  - [POST /incrementCurrentTopic](#post-incrementcurrenttopic)
  - [POST /addQuestionByIdToTopic](#post-addquestionbyidtotopic)
  - [GET /getAllQuestions](#get-getallquestions)
  - [GET /getAllClasses](#get-getallclasses)
- [Socket.IO Events](#socketio-events)
  - [Server-Side Events](#server-side-events)
    - [joinClass](#joinclass)
    - [voteOnQuestion](#voteonquestion)
    - [disconnect](#disconnect)
  - [Client-Side Events](#client-side-events)
    - [currentTopic](#currenttopic)
    - [voteAcknowledged](#voteacknowledged)
- [Data Models](#data-models)
  - [Class Schema](#class-schema)
  - [Question Schema](#question-schema)
- [Usage Examples](#usage-examples)
  - [API Requests](#api-requests)
  - [Socket.IO Client Usage](#socketio-client-usage)
- [Notes](#notes)
- [Conclusion](#conclusion)

---

## API Endpoints

### POST /incrementCurrentTopic

Increments the current topic index for a specified class.

- **URL**: `/incrementCurrentTopic`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body**:

  ```json
  {
    "classId": "String" // Required
  }
  ```

- **Success Response**:

  - **Status Code**: `200 OK`
  - **Body**:

    ```json
    {
      "success": true,
      "newTopicIndex": Number
    }
    ```

- **Error Response**:

  - **Status Code**: `500 Internal Server Error`
  - **Body**:

    ```json
    {
      "success": false,
      "error": "Error message"
    }
    ```

- **Description**:

  Increments the `cur_topic` field in the database for the specified class. Emits a WebSocket event `topicUpdated` to all connected clients in that class room to notify them of the topic change.

- **Example Request**:

  ```json
  POST /incrementCurrentTopic
  Content-Type: application/json

  {
    "classId": "60f83ab9bfef096374e15eea"
  }
  ```

- **Example Response**:

  ```json
  {
    "success": true,
    "newTopicIndex": 3
  }
  ```

---

### POST /addQuestionByIdToTopic

Adds a question to a specific topic within a class.

- **URL**: `/addQuestionByIdToTopic`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body**:

  ```json
  {
    "className": "String", // Required
    "topicName": "String", // Required
    "questionId": "String" // Required
  }
  ```

- **Success Response**:

  - **Status Code**: `200 OK`
  - **Body**:

    ```json
    {
      "success": true,
      "message": "Question added to topic [topicName] in class [className]"
    }
    ```

- **Error Responses**:

  - **Status Code**: `400 Bad Request`

    ```json
    {
      "error": "className, topicName, and questionId are required"
    }
    ```

  - **Status Code**: `500 Internal Server Error`

    ```json
    {
      "error": "Failed to add question to topic"
    }
    ```

- **Description**:

  Adds a question to a specified topic within a class by updating the database. Validates that all required fields are provided.

- **Example Request**:

  ```json
  POST /addQuestionByIdToTopic
  Content-Type: application/json

  {
    "className": "Mathematics",
    "topicName": "Calculus",
    "questionId": "60f839bdbfef096374e15ee0"
  }
  ```

- **Example Response**:

  ```json
  {
    "success": true,
    "message": "Question added to topic Calculus in class Mathematics"
  }
  ```

---

### GET /getAllQuestions

Retrieves all questions from the database.

- **URL**: `/getAllQuestions`
- **Method**: `GET`
- **Headers**: None
- **Query Parameters**: None

- **Success Response**:

  - **Status Code**: `200 OK`
  - **Body**:

    ```json
    [
      {
        "_id": "60f839bdbfef096374e15ee0",
        "question": "What is the derivative of x^2?"
      },
      {
        "_id": "60f839bdbfef096374e15ee1",
        "question": "Explain Newton's second law."
      }
      // ...additional questions
    ]
    ```

- **Error Response**:

  - **Status Code**: `500 Internal Server Error`

    ```json
    {
      "success": false,
      "message": "Failed to fetch questions"
    }
    ```

- **Description**:

  Fetches all questions from the `questions` collection in the database.

- **Example Request**:

  ```http
  GET /getAllQuestions
  ```

- **Example Response**:

  ```json
  [
    {
      "_id": "60f839bdbfef096374e15ee0",
      "question": "What is the derivative of x^2?"
    },
    {
      "_id": "60f839bdbfef096374e15ee1",
      "question": "Explain Newton's second law."
    }
    // ...additional questions
  ]
  ```

---

### GET /getAllClasses

Retrieves all classes from the database.

- **URL**: `/getAllClasses`
- **Method**: `GET`
- **Headers**: None
- **Query Parameters**: None

- **Success Response**:

  - **Status Code**: `200 OK`
  - **Body**:

    ```json
    [
      {
        "_id": "60f83ab9bfef096374e15eea",
        "class_name": "Mathematics",
        "cur_topic": 2,
        "topics": [
          {
            "topic_name": "Algebra",
            "questions": [
              {
                "questionId": "60f839bdbfef096374e15ee0",
                "answers": [0, 1, 0, 0, 0]
              }
            ]
          }
          // ...additional topics
        ]
      }
      // ...additional classes
    ]
    ```

- **Error Response**:

  - **Status Code**: `500 Internal Server Error`

    ```json
    {
      "success": false,
      "message": "Failed to fetch classes"
    }
    ```

- **Description**:

  Fetches all classes from the `classes` collection in the database.

- **Example Request**:

  ```http
  GET /getAllClasses
  ```

- **Example Response**:

  ```json
  [
    {
      "_id": "60f83ab9bfef096374e15eea",
      "class_name": "Mathematics",
      "cur_topic": 2,
      "topics": [
        {
          "topic_name": "Algebra",
          "questions": [
            {
              "questionId": "60f839bdbfef096374e15ee0",
              "answers": [0, 1, 0, 0, 0]
            }
          ]
        }
      ]
    }
    // ...additional classes
  ]
  ```

---

## Socket.IO Events

### Server-Side Events

These events are emitted by the client and listened to by the server.

#### joinClass

Allows a client to join a specific class room.

- **Event Name**: `joinClass`
- **Data Payload**:

  ```json
  {
    "classId": "String" // Required
  }
  ```

- **Description**:

  When a client emits `joinClass`, the server adds the client to a room corresponding to the class ID. The server then sends the current topic to the client via the `currentTopic` event.

- **Example Client Emission**:

  ```javascript
  socket.emit("joinClass", { classId: "60f83ab9bfef096374e15eea" });
  ```

#### voteOnQuestion

Allows a client to vote on a question.

- **Event Name**: `voteOnQuestion`
- **Data Payload**:

  ```json
  {
    "className": "String",      // Required
    "topicName": "String",      // Required
    "questionId": "String",     // Required
    "answerIndex": Number       // Required, 0-4
  }
  ```

- **Description**:

  When a client emits `voteOnQuestion`, the server records the vote and optionally acknowledges it via the `voteAcknowledged` event.

- **Example Client Emission**:

  ```javascript
  socket.emit("voteOnQuestion", {
    className: "Mathematics",
    topicName: "Calculus",
    questionId: "60f839bdbfef096374e15ee0",
    answerIndex: 2,
  });
  ```

#### disconnect

Emitted when a client disconnects.

- **Event Name**: `disconnect`
- **Description**:

  The server logs when a client disconnects. No data payload is sent with this event.

- **Example Server Listener**:

  ```javascript
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
  ```

### Client-Side Events

These events are emitted by the server and listened to by the client.

#### currentTopic

Sends the current topic index to the client upon joining a class.

- **Event Name**: `currentTopic`
- **Data Payload**:

  ```json
  {
    "currentTopic": Number
  }
  ```

- **Description**:

  Sent by the server after the client joins a class, providing the current topic index.

- **Example Server Emission**:

  ```javascript
  socket.emit("currentTopic", { currentTopic: 2 });
  ```

#### voteAcknowledged

Acknowledges that a vote has been recorded.

- **Event Name**: `voteAcknowledged`
- **Data Payload**:

  ```json
  {
    "success": Boolean,
    "error": "String" // Optional, only if success is false
  }
  ```

- **Description**:

  Sent by the server in response to a `voteOnQuestion` event to inform the client whether the vote was successfully recorded.

- **Example Server Emission**:

  ```javascript
  // On success
  socket.emit("voteAcknowledged", { success: true });

  // On failure
  socket.emit("voteAcknowledged", {
    success: false,
    error: "Error message",
  });
  ```

---

## Data Models

### Class Schema

Represents a class with topics and questions.

- **Fields**:

  - `_id` (ObjectId): Unique identifier for the class.
  - `class_name` (String): Name of the class.
  - `cur_topic` (Number): Index of the current topic.
  - `topics` (Array of Objects):

    - `topic_name` (String): Name of the topic.
    - `questions` (Array of Objects):

      - `questionId` (ObjectId): Reference to a question.
      - `answers` (Array of Numbers): Vote counts for each answer option.

### Question Schema

Represents a question.

- **Fields**:

  - `_id` (ObjectId): Unique identifier for the question.
  - `question` (String): The question text.
  - `options` (Array of Strings): Possible answers.
  - Additional fields as needed.

---

## Usage Examples

### API Requests

#### Increment Current Topic

```javascript
fetch("http://localhost:8080/incrementCurrentTopic", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ classId: "60f83ab9bfef096374e15eea" }),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      console.log(`New topic index: ${data.newTopicIndex}`);
    } else {
      console.error(`Error: ${data.error}`);
    }
  })
  .catch((error) => console.error("Fetch error:", error));
```

#### Add Question to Topic

```javascript
fetch("http://localhost:8080/addQuestionByIdToTopic", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    className: "Mathematics",
    topicName: "Calculus",
    questionId: "60f839bdbfef096374e15ee0",
  }),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      console.log(data.message);
    } else {
      console.error(`Error: ${data.error}`);
    }
  })
  .catch((error) => console.error("Fetch error:", error));
```

#### Get All Questions

```javascript
fetch("http://localhost:8080/getAllQuestions")
  .then((response) => response.json())
  .then((questions) => {
    console.log("Questions:", questions);
  })
  .catch((error) => console.error("Fetch error:", error));
```

#### Get All Classes

```javascript
fetch("http://localhost:8080/getAllClasses")
  .then((response) => response.json())
  .then((classes) => {
    console.log("Classes:", classes);
  })
  .catch((error) => console.error("Fetch error:", error));
```

### Socket.IO Client Usage

```javascript
import { io } from "socket.io-client";

// Connect to the server
const socket = io("http://localhost:8080");

// Join a class
const classId = "60f83ab9bfef096374e15eea";
socket.emit("joinClass", { classId });

// Listen for the current topic
socket.on("currentTopic", (data) => {
  console.log(`Current topic is: ${data.currentTopic}`);
});

// Vote on a question
function voteOnQuestion(className, topicName, questionId, answerIndex) {
  socket.emit("voteOnQuestion", {
    className,
    topicName,
    questionId,
    answerIndex,
  });
}

// Listen for vote acknowledgment
socket.on("voteAcknowledged", (data) => {
  if (data.success) {
    console.log("Vote recorded successfully.");
  } else {
    console.error(`Vote failed: ${data.error}`);
  }
});

// Example vote
voteOnQuestion("Mathematics", "Calculus", "60f839bdbfef096374e15ee0", 2);
```

---

## Notes

- **Environment Variables**:

  - Ensure that `CONNECT_STRING` is set in your environment variables for MongoDB connection.

- **CORS Configuration**:

  - The server is configured to allow all origins (`origin: "*"`) in the Socket.IO server. Adjust as necessary for your security requirements.

- **Error Handling**:

  - All API endpoints and Socket.IO events include basic error handling. Be sure to handle errors on the client side.

- **MongoDB Connection**:

  - The server connects to MongoDB within Socket.IO events. Ensure that this connection is managed appropriately in a production environment (e.g., using a singleton connection).

- **Socket.IO Version Compatibility**:

  - Ensure that the versions of `socket.io` on the server and `socket.io-client` on the client are compatible.

---

## Conclusion

This documentation provides an overview of the API endpoints and Socket.IO events for your application. It enables functionality such as:

- Incrementing the current topic of a class.
- Adding questions to specific topics within a class.
- Fetching all questions and classes.
- Real-time communication between the server and clients through Socket.IO.

By following this documentation, you can integrate these endpoints and events into your application to facilitate interactive educational experiences between lecturers and students.

---

If you have any further questions or need assistance, feel free to reach out.
