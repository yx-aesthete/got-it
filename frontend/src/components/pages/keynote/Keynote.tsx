import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import KeynoteEntity from "../../organisms/KeynoteEntity";
import { listOfKeynotes } from "./KeynoteList.mock";
import { useClassContext } from "../../../contexts/ClassContext";

const KeynoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100%;
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

const calculateHeight = (
  height: number,
  timeEstimated: number,
  fullTime: number
) => {
  return ((height / fullTime) * 1000) as number; // Adjust height calculation for consistency
};

const calculateTotalTime = (listOfKeynotes: any[]) => {
  return listOfKeynotes.reduce((acc, curr) => acc + curr.timeEstimated * 60, 0); // Convert minutes to seconds
};

export default function KeynoteList() {
  const keynoteWrapperRef = useRef<HTMLDivElement>(null);
  const [loaderHeight, setLoaderHeight] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const { activeClass, presentingName } = useClassContext();

  const totalTime = calculateTotalTime(listOfKeynotes); // Total time in seconds
  const isScrollable = listOfKeynotes.length > 10;

  useEffect(() => {
    // Reset loader height if the presenting name does not match the active class
    if (presentingName !== activeClass) {
      setLoaderHeight(0);
      setStartTime(null); // Reset the start time
      return; // Exit early if not presenting the active class
    }

    // If the presenting name matches the active class, start tracking time
    if (startTime === null) {
      setStartTime(Date.now()); // Set the start time
    }

    const interval = setInterval(() => {
      if (startTime) {
        const elapsedTime = (Date.now() - startTime) / 1000; // Calculate elapsed time in seconds
        const proportion = elapsedTime / totalTime; // Proportional value based on total time (in seconds)
        setLoaderHeight(proportion * 200); // Update loader height (max height can be set to 200)
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [presentingName, activeClass, startTime, totalTime]);

  return (
    <KeynoteWithProgress>
      <KeynoteContainer ref={keynoteWrapperRef}>
        {listOfKeynotes.map((keynote, index) => (
          <React.Fragment key={keynote.id}>
            <KeynoteEntity
              isodd={index % 2 === 0}
              height={calculateHeight(
                keynote.timeEstimated * 60, // Convert time to seconds for the entity
                totalTime,
                totalTime
              )}
              title={keynote.title}
              isActive={false}
              index={index}
            />
          </React.Fragment>
        ))}
      </KeynoteContainer>
      <Loader height={loaderHeight} />
    </KeynoteWithProgress>
  );
}
