import React from "react";
import { styled } from "styled-components";
import ClassEntity from "../../organisms/ClassEntity";
import { listOfClasses } from "./ClassList.mock";
import { useClassContext } from "../../../hooks/useClassContext";

const ClassListWrapper = styled.div`
  width: 33vw;
  max-height: 100%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 12px;
  overflow-y: scroll;
  background-color: ${(props) => props.theme.colors.purpleMid};
  filter: drop-shadow(3px 0px 12px #e029d19b);
`;

export default function ClassList() {
  const { activeClass, setActiveClass } = useClassContext();

  return (
    <ClassListWrapper>
      {listOfClasses.map((classItem) => (
        <ClassEntity
          key={classItem.id}
          name={classItem.name}
          description={classItem.description}
          isActive={activeClass === classItem.name}
          onClick={() => setActiveClass(classItem.name)}
        />
      ))}
    </ClassListWrapper>
  );
}
