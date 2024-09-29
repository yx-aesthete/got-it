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
  classes: Array<{ id: string; name: string; description?: string }>;
}

export default function ClassList({ classes }: ClassListProps) {
  const { activeClass, setActiveClass } = useClassContext();
  console.log("🚀 ~ ClassList ~ activeClass:", activeClass)

  return (
    <ClassListWrapper>
      {classes.map((classItem) => (
        <ClassEntity
          key={classItem.id}
          name={classItem.name}
          // description={classItem.description}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
          }
          isActive={activeClass === classItem.name}
          onClick={() => setActiveClass(classItem.name)}
        />
      ))}
    </ClassListWrapper>
  );
}
