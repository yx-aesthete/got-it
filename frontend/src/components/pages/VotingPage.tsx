import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import gsap from "gsap";
import Typography from "../atoms/typography/Typography";
import { HighlightLevel, TypographyVariant } from "../atoms/typography/Typography.autogen";

// Example questions array (can be dynamic or received from the server)
export const Questions = [
  { id: 0, content: "U got it?" },
  { id: 1, content: "U like it?" },
  { id: 2, content: "How would you rate it?" },
];

// Styling for the header
const Header = styled.div`
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

// Styling for the voting page wrapper
const VotingPageWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 3px;
  position: relative;
  overflow-y: auto;
  padding-top: 180px;
  height: calc(100vh - 180px);
`;

// Styling for each voting cell
const Cell = styled.div<{ isActive: boolean }>`
  width: 10vw;
  height: calc((100vh - 180px) / ${Questions.length});
  background-color: ${(props) =>
    props.isActive ? props.theme.colors.purpleLight : props.theme.colors.purpleMid};
  transition: background-color 0.1s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
  position: relative;
  z-index: 5;
`;

// Styling for the question labels
const QuestionLabel = styled.div<{ rowIndex: number }>`
  position: absolute;
  left: 0;
  top: ${(props) => props.rowIndex * (80 / Questions.length)}%;
  z-index: 10;
  font-size: 18px;
  color: ${(props) => props.theme.colors.purpleDark};
  pointer-events: none;
  display: flex;
  align-items: center;
  padding-left: 5px;
  margin-top: 180px;
`;

export default function VotingPage({ socket, currentTopic }: { socket: any, currentTopic: string }) {
  // State to track active cells (votes) for each question
  const [activeCells, setActiveCells] = useState<number[]>(Array(Questions.length).fill(0));

  useEffect(() => {
    // Log the received current topic to verify that it's passed correctly
    console.log("VotingPage received currentTopic:", currentTopic);
  }, [currentTopic]);

  // Handle cell click (voting action) and emit the vote to the server
  const handleCellClick = (questionIndex: number, cellIndex: number) => {
    const newActiveCells = [...activeCells];
    newActiveCells[questionIndex] = cellIndex + 1;
    setActiveCells(newActiveCells);

    // Emit the vote to the server
    socket.emit("voteOnQuestion", {
      className: "example_class", // Replace with actual class name
      topicName: currentTopic, // Use the current topic received as a prop
      questionId: questionIndex, // Question index
      answerIndex: cellIndex + 1, // Index of the selected answer
    });

    // Animate the voting cell using GSAP
    gsap.to(`.cell-${questionIndex}`, {
      y: (i) => (i <= cellIndex ? -10 : 0),
      stagger: 0.05,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <>
      {/* Header to display the current topic */}
      <Header>
        <Typography
          animated
          animationType="fade"
          variant={TypographyVariant.megaSubHeader}
          highlight_level={HighlightLevel.neutral}
        >
          Current Topic: {currentTopic || "No Topic Available"}
        </Typography>
      </Header>

      {/* Voting Grid: Iterate through questions and render voting cells */}
      <VotingPageWrapper>
        {Questions.map((question, questionIndex) => (
          <React.Fragment key={question.id}>
            {/* Question Label */}
            <QuestionLabel rowIndex={questionIndex}>
              <Typography
                animated
                animationType="fade"
                variant={TypographyVariant.bigHeader}
                highlight_level={HighlightLevel.active}
              >
                {question.content}
              </Typography>
            </QuestionLabel>

            {/* Render 10 voting cells for each question */}
            {[...Array(1)].map((_, cellIndex) => (
              <Cell
                key={cellIndex}
                isActive={cellIndex < activeCells[questionIndex]} // Highlight selected cells
                className={`cell-${questionIndex}`} // For GSAP animation targeting
                onClick={() => handleCellClick(questionIndex, cellIndex)} // Handle vote click
              />
            ))}
          </React.Fragment>
        ))}
      </VotingPageWrapper>
    </>
  );
}
