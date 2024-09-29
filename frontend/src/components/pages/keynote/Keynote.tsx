import React from "react";
import styled, { keyframes } from "styled-components";
import KeynoteEntity from "../../organisms/KeynoteEntity";
import { listOfKeynotes } from "./KeynoteList.mock"; 

const grow = keyframes`
  from {
    height: 0%;
  }
  to {
    height: 100%;
  }
`;

const ProgressBar = styled.div`
  width: 5%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.purpleLight};
  animation: ${grow} 2s ease-in-out forwards;
  overflow: hidden;
`;

const KeynoteContainer = styled.div`
  display: flex;
  width: 90vw; 
  height: 90vh; 
  justify-content: flex-start; 
  align-items: center; 
  margin: auto 0; 
  background-color: ${(props) => props.theme.colors.purpleDark};
  border-radius: 12px; 
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
`;

const KeynoteListWrapper = styled.div<{ isScrollable: boolean }>`
  width: 50%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(${({ isScrollable }) => (isScrollable ? "auto-fill" : "1fr")}, 1fr);
  gap: 12px;
  padding: 20px;
  overflow-y: ${({ isScrollable }) => (isScrollable ? "scroll" : "hidden")};
  background-color: ${(props) => props.theme.colors.purpleMid};
  border-radius: 12px; 
`;

export default function KeynoteList() {
  const totalHeight = listOfKeynotes.reduce((sum, keynote) => sum + keynote.height, 0);

  const isScrollable = listOfKeynotes.length > 10;

  return (
    <KeynoteContainer>
      <KeynoteListWrapper isScrollable={isScrollable}>
        {listOfKeynotes.map((keynote, index) => {
          const heightPercentage = (keynote.height / totalHeight) * 100;

          return (
            <KeynoteEntity
              key={keynote.id}
              title={keynote.title}
              isActive={false}
              heightPercentage={heightPercentage}
              index={index}
            />
          );
        })}
      </KeynoteListWrapper>
      <ProgressBar />
    </KeynoteContainer>
  );
}
