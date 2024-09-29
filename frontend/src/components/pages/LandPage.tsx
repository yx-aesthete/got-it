import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import io from "socket.io-client";
import Typography from "../atoms/typography/Typography";
import { HighlightLevel, TypographyVariant } from "../atoms/typography/Typography.autogen";
import VotingPage from "./VotingPage"; // Import the VotingPage component

// WebSocket connection to your server (make sure to replace the URL)
const socket = io('http://localhost:3001'); // Replace with your WebSocket server URL

// Styled components for the landing page
const LandingPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.purpleMid};
  color: white;
  text-align: center;
`;

export default function LandingPage() {
  const [currentTopic, setCurrentTopic] = useState<string>(""); // Store current topic
  const [startVoting, setStartVoting] = useState<boolean>(false); // Control switching to VotingPage

  useEffect(() => {
    // Listen for the 'currentTopic' event from the server
    socket.on("currentTopic", (data) => {
      console.log("Received currentTopic from server:", data); // Debugging
      setCurrentTopic(data.currentTopic); // Set current topic received from the server
    });

    // Listen for the 'startVoting' event from the server
    socket.on("startVoting", () => {
      console.log("Voting started"); // Debugging
      setStartVoting(true); // Switch to VotingPage when the server sends the 'startVoting' event
    });

    // Cleanup WebSocket listeners on component unmount
    return () => {
      socket.off("currentTopic");
      socket.off("startVoting");
    };
  }, []);

  // If voting has started, switch to the VotingPage component
  if (startVoting) {
    return <VotingPage socket={socket} currentTopic={currentTopic} />;
  }

  return (
    <LandingPageWrapper>
      <Typography
        animated
        animationType="fade"
        variant={TypographyVariant.megaSubHeader}
        highlight_level={HighlightLevel.neutral}
      >
        Welcome to the Class
      </Typography>

      <Typography
        animated
        animationType="fade"
        variant={TypographyVariant.bigHeader}
        highlight_level={HighlightLevel.neutral}
      >
        Current Topic: {currentTopic || "Waiting for Topic..."}
      </Typography>
    </LandingPageWrapper>
  );
}
