import React from "react";
import styled, { keyframes } from "styled-components";
import KeynoteEntity from "../../organisms/KeynoteEntity";
import { listOfKeynotes } from "./KeynoteList.mock";

const KeynoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100%;
  justify-content: flex-start;
`;

const KeynoteListWrapper = styled.div<{ isScrollable: boolean }>``;

const calculateHeight = (
  height: number,
  timeEstimated: number,
  fullTime: number
) => {
  return ((height / fullTime) * 1000) as number;
};

const calculateTotalTime = (listOfKeynotes: any[]) => {
  return listOfKeynotes.reduce(
    (sum, keynote) => sum + keynote.timeEstimated,
    0
  );
};

export default function KeynoteList() {
  const keynoteWrapperRef = React.useRef<HTMLDivElement>(null);
  const keynoteWrapperRefHeight = keynoteWrapperRef.current
    ?.clientHeight as number;
  console.log(
    "🚀 ~ KeynoteList ~ keynoteWrapperRefHeight:",
    keynoteWrapperRefHeight
  );

  const totalTime = calculateTotalTime(listOfKeynotes);

  const isScrollable = listOfKeynotes.length > 10;

  return (
    <KeynoteContainer ref={keynoteWrapperRef}>
      {listOfKeynotes.map((keynote, index) => {
        return (
          <KeynoteEntity
            isOdd={index % 2 === 0}
            height={calculateHeight(
              keynote.timeEstimated,
              totalTime,
              totalTime
            )}
            key={keynote.id}
            title={keynote.title}
            isActive={false}
            index={index}
          />
        );
      })}
    </KeynoteContainer>
  );
}
