import React from "react";
import { styled } from "styled-components";
import ClassEntity from "../ClassEntity";
import { useClassContext } from "../../../hooks/useClassContext";

// Styling for the class list wrapper
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

// Define the type for the classes prop
interface ClassListProps {
  classes: Array<{
    class_name: string | undefined;
    id: string;
    name: string;
    description?: string;
  }>;
}

export default function ClassList({ classes }: ClassListProps) {
  const { activeClass, setActiveClassWrapper } = useClassContext();
  

  return (
    <ClassListWrapper>
      {classes.map((classItem) => (
        <ClassEntity
          key={classItem.id}
          name={classItem.class_name}
          description={classItem.description}
          isActive={classItem.class_name === activeClass}
          onClick={() => setActiveClassWrapper(classItem.class_name)}
        />
      ))}
    </ClassListWrapper>
  );
}
