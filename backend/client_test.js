import io from "socket.io-client";

// Connect to the WebSocket server
const socket = io("http://localhost:8080"); // Adjust the URL if needed

// Example classId to join (replace with actual class ID from your database)
const classId = "YOUR_CLASS_ID_HERE";

// Join the class room to get real-time updates
socket.emit("joinClass", { classId });

// Listen for the current topic when you join the class
socket.on("currentTopic", (data) => {
  console.log(`Current topic is: ${data.currentTopic}`);
  // Update your UI or internal state with the current topic
});

// Listen for updates to the current topic (when the lecturer changes it)
socket.on("curTopicChanged", (data) => {
  console.log(`Topic changed! New topic is: ${data.newCurTopic}`);
  // Update the UI accordingly to show the new topic
});

// Send a vote to the server (as a student)
function voteOnQuestion(topicName, questionId, answerIndex) {
  socket.emit("voteOnQuestion", {
    classId,
    topicName,
    questionId,
    answerIndex,
  });
  console.log(
    `Vote submitted for question ${questionId} on topic ${topicName}`
  );
}

// Example: Voting on a question
// You can call this function from your code or manually for testing purposes
setTimeout(() => {
  voteOnQuestion("Algebra", "SAMPLE_QUESTION_ID", 1); // Answer 1 (e.g., "No")
}, 5000); // Wait 5 seconds after connecting

// Handle disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
