import React, { useState } from "react";
import { styled } from "styled-components";
import gsap from "gsap";
import Typography from "../atoms/typography/Typography";
import { HighlightLevel, TypographyVariant } from "../atoms/typography/Typography.autogen";

// Questions array
export const Questions = [
  { id: 0, content: "U got it?" },
  { id: 1, content: "U like it?" },
  { id: 2, content: "U need it?" }, // Unique IDs for each question
];

// Styling for the voting page wrapper
const VotingPageWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(${Questions.length}, auto);
  gap: 3px; /* 3px gap between both columns and rows */
`;

// Styling for each voting cell
const Cell = styled.div<{ isActive: boolean }>`
  width: 10vw;
  height: calc(
    90vh / ${Questions.length}
  ); /* Height is 1/amount of questions */
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
`;

// Styling for the question labels
const QuestionLabel = styled.div`
  grid-column: 1 / -1; /* Span across all columns */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: ${(props) => props.theme.colors.purpleDark};
  position: absolute; /* Make the label overlap the cells */
  width: 100%;
  height: 100%;
  pointer-events: none; /* Allow clicks to pass through the label to cells */
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

  return (
    <VotingPageWrapper>
      {Questions.map((question, questionIndex) => (
        <React.Fragment key={question.id}>
          {/* Render the question label */}
          <QuestionLabel>
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
  );
}
