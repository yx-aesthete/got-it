import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import KeynoteEntity from "../../organisms/KeynoteEntity";
import { listOfKeynotes } from "./KeynoteList.mock";
import { useClassContext } from "../../../contexts/ClassContext";

const KeynoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100vh; /* Use 80% of the viewport height */
  justify-content: flex-start;
`;

const Loader = styled.div<{ height: number }>`
  width: 100%;
  height: ${(props) => props.height}px;
  background-color: ${(props) => props.theme.colors.blueLight};
  display: flex;
  justify-content: flex-start;
  width: 4px;
`;

const KeynoteWithProgress = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const calculateTotalTime = (listOfKeynotes: any[]) => {
  return listOfKeynotes.reduce((acc, curr) => acc + curr.timeEstimated * 60, 0); // Total time in seconds
};

export default function KeynoteList() {
  const keynoteWrapperRef = useRef<HTMLDivElement>(null);
  const [loaderHeight, setLoaderHeight] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [completedKeynotes, setCompletedKeynotes] = useState<boolean[]>([]);

  const { activeClass, presentingName } = useClassContext();

  const totalTime = calculateTotalTime(listOfKeynotes); // Total time in seconds
  const screenHeight = window.innerHeight;

  useEffect(() => {
    if (presentingName !== activeClass) {
      setLoaderHeight(0);
      setStartTime(null); // Reset the start time
      setCompletedKeynotes(Array(listOfKeynotes.length).fill(false)); // Reset completion status
      return; // Exit early if not presenting the active class
    }

    if (startTime === null) {
      setStartTime(Date.now()); // Set the start time
    }

    const interval = setInterval(() => {
      if (startTime) {
        const elapsedTime = (Date.now() - startTime) / 1000; // Calculate elapsed time in seconds
        const proportion = Math.min(elapsedTime / totalTime, 1); // Ensure proportion doesn't exceed 1

        // Calculate the loader height based on the proportion of the total screen height
        setLoaderHeight(proportion * screenHeight);

        // Update completed keynotes based on elapsed time
        const updatedKeynotes = listOfKeynotes.map((keynote, index) => {
          const keynoteEndTime = listOfKeynotes
            .slice(0, index + 1)
            .reduce((acc, curr) => acc + curr.timeEstimated * 60, 0);
          return elapsedTime >= keynoteEndTime; // Check completion status
        });
        setCompletedKeynotes(updatedKeynotes);
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [presentingName, activeClass, startTime, totalTime, listOfKeynotes]);

  return (
    <KeynoteWithProgress ref={keynoteWrapperRef}>
      <KeynoteContainer>
        {listOfKeynotes.map((keynote, index) => {
          // Calculate the height of each keynote entity as a proportion of the screen height
          const height =
            ((keynote.timeEstimated * 60) / totalTime) * screenHeight;

          return (
            <KeynoteEntity
              key={keynote.id}
              isodd={index % 2 === 0}
              height={height} // Calculate height based on proportion of total time
              title={keynote.title}
              isActive={keynote.title === activeClass} // Determine if the keynote is active
              hasBeenCompleted={completedKeynotes[index]} // Pass completion status
              index={index}
            />
          );
        })}
      </KeynoteContainer>
      <Loader height={loaderHeight} />
    </KeynoteWithProgress>
  );
}
