import React from "react";
import { styled } from "styled-components";
import ControlIcons from "../molecules/ControllIcons";
import { useClassContext } from "../../hooks/useClassContext";
import KeynoteList from "../pages/keynote/Keynote";

const ClassContainerWrapper = styled.div`
  width: 66vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export default function ClassContainer() {
  // Destructure values returned from useClassContext
  const { activeClass, isPresenting, isEditing, handlePresent, handleEdit } =
    useClassContext();

  return (
    <ClassContainerWrapper>
      {activeClass && (
        <ControlIcons
          isPresenting={isPresenting}
          isEditing={isEditing}
          isSharing={false}
          handlePresenting={() => handlePresent()}
          handleEditing={() => handleEdit()}
          handleSharing={() => {}}
        />
      )}
      <KeynoteList />
    </ClassContainerWrapper>
  );
}
