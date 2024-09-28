import React from "react";
import { styled } from "styled-components";
import ClassEntity from "../../organisms/ClassEntity";

const ClassListWrapper = styled.div`
  width: 33vw;
  height: 100vh;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 12px;
  overflow-y: scroll;
  background-color: ${(props) => props.theme.colors.purpleMid};
  filter: drop-shadow(3px 0px 12px #e029d19b);
`;

const listOfClasses = [
  { id: 1, name: "Class 1", description: "Description 1" },
  { id: 2, name: "Class 2", description: "Description 2" },
  { id: 3, name: "Class 3", description: "Description 3" },
  { id: 4, name: "Class 4", description: "Description 4" },
  { id: 5, name: "Class 5", description: "Description 5" },
  { id: 5, name: "Class 5", description: "Description 5" },
  { id: 5, name: "Class 5", description: "Description 5" },
  { id: 5, name: "Class 5", description: "Description 5" },
  { id: 5, name: "Class 5", description: "Description 5" },
  { id: 5, name: "Class 5", description: "Description 5" },
];

export default function ClassList() {
  return (
    <ClassListWrapper>
      {listOfClasses.map((classItem) => (
        <ClassEntity
          key={classItem.id}
          name={classItem.name}
          description={classItem.description}
        />
      ))}
    </ClassListWrapper>
  );
}
