import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import gsap from "gsap";
import Typography from "../atoms/typography/Typography";
import {
  HighlightLevel,
  TypographyVariant,
} from "../atoms/typography/Typography.autogen";

// Questions array
export const Questions = [
  { id: 0, content: "U got it?" },
  { id: 1, content: "U like it?" },
  { id: 2, content: "U like it?" },
];

// Styling for the header
const Header = styled.div`
  width: 100%;
  height: 180px; /* Fixed height for the header */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  position: absolute; /* Make it positioned absolutely at the top */
  top: 0;
  left: 0;
  z-index: 1; /* Lower z-index to stay under the tiles */
`;

// Styling for the voting page wrapper
const VotingPageWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr); /* 10 equal columns */
  gap: 3px; /* 3px gap between both columns and rows */
  position: relative; /* Position relative for absolutely positioned elements inside */
  overflow-y: auto; /* Allow scrolling if content overflows */
  padding-top: 180px; /* Add padding to start tiles below the header */
  height: calc(100vh - 180px); /* Full height minus the header */
`;

// Styling for each voting cell
const Cell = styled.div<{ isActive: boolean }>`
  width: 10vw; /* Full width divided into 10 columns */
  height: calc(
    (100vh - 180px) / ${Questions.length}
  ); /* Distribute the remaining height among rows */
  background-color: ${(props) =>
    props.isActive
      ? props.theme.colors.purpleLight
      : props.theme.colors.purpleMid};
  transition: background-color 0.1s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
  position: relative;
  z-index: 5; /* Higher z-index to appear above the labels */
`;

// Styling for the question labels
const QuestionLabel = styled.div<{ rowIndex: number }>`
  position: absolute; /* Position the labels absolutely */
  left: 0; /* Align to the left of the container */
  top: ${(props) =>
    props.rowIndex *
    (80 / Questions.length)}%; /* Adjust top based on row index */
  z-index: 10; /* Higher z-index to appear above the cells */
  font-size: 18px;
  color: ${(props) => props.theme.colors.purpleDark};
  pointer-events: none; /* Allow clicks to pass through to cells */
  display: flex;
  align-items: center; /* Center the text vertically */
  padding-left: 5px; /* Optional: Add padding to adjust text position */
  margin-top: 180px;
`;

export default function VotingPage() {
  // State to manage active cells for each question
  const [activeCells, setActiveCells] = useState<number[]>(
    Array(Questions.length).fill(0)
  );

  // Handle cell click to set the active cells for each row
  const handleCellClick = (questionIndex: number, cellIndex: number) => {
    const newActiveCells = [...activeCells];
    newActiveCells[questionIndex] = cellIndex + 1; // Set the active cells up to the clicked cell
    setActiveCells(newActiveCells);

    // GSAP stagger animation for smooth up and down motion
    gsap.to(`.cell-${questionIndex}`, {
      y: (i) => (i <= cellIndex ? -10 : 0), // Move up selected cells and reset others
      stagger: 0.05, // Add stagger effect
      duration: 0.3,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    // Set CSS variable for name area height
    document.documentElement.style.setProperty("--name-area-height", "180px");
  }, []);

  return (
    <>
      <Header>
        <Typography
          animated
          animationType="fade"
          variant={TypographyVariant.megaSubHeader}
          highlight_level={HighlightLevel.neutral}
        >
          Pool Name
        </Typography>
      </Header>

      {/* Voting Page Grid */}
      <VotingPageWrapper>
        {Questions.map((question, questionIndex) => (
          <React.Fragment key={question.id}>
            {/* Render the question label */}
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

            {/* Render 10 cells for each question */}
            {[...Array(10)].map((_, cellIndex) => (
              <Cell
                key={cellIndex}
                isActive={cellIndex < activeCells[questionIndex]}
                className={`cell-${questionIndex}`}
                onClick={() => handleCellClick(questionIndex, cellIndex)}
              />
            ))}
          </React.Fragment>
        ))}
      </VotingPageWrapper>
    </>
  );
}