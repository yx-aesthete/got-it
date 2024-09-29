import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
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
    
  );
};

const countHeightProgress = (timePassed: number, totalTime: number) => {
  return (timePassed / totalTime) * 1000;
};

export default function KeynoteList() {
  const keynoteWrapperRef = React.useRef<HTMLDivElement>(null);
  const keynoteWrapperRefHeight = keynoteWrapperRef.current
    ?.clientHeight as number;
  console.log(
    "🚀 ~ KeynoteList ~ keynoteWrapperRefHeight:",
    keynoteWrapperRefHeight
  );

  const [startTime, setStartTime] = React.useState<Date>();
  const [timePassed, setTimePassed] = React.useState<number>(0);

  const timeStarter = () => {
    setStartTime(new Date());
  };

  const countTimeSinceStart = () => {
    timeStarter();
    setInterval(() => {
      if (startTime) {
        setTimePassed(new Date().getTime() - startTime.getTime());
      }
    }, 1000);
  };

  const { activeClass } = useClassContext();

  useEffect(() => {
    timeStarter();
    countTimeSinceStart();
  }, [activeClass]);

  const totalTime = calculateTotalTime(listOfKeynotes);

  const isScrollable = listOfKeynotes.length > 10;

  return (
    <KeynoteWithProgress>
      <KeynoteContainer ref={keynoteWrapperRef}>
        {listOfKeynotes.map((keynote, index) => (
          <React.Fragment key={keynote.id}>
            <KeynoteEntity
              isodd={index % 2 === 0}
              height={calculateHeight(
                keynote.timeEstimated,
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
      <Loader height={countHeightProgress(timePassed, totalTime)} />
    </KeynoteWithProgress>
  );
}
