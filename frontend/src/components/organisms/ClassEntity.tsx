import React from "react";
import styled from "styled-components";
import Typography from "../atoms/typography/Typography";
import {
  HighlightLevel,
  TypographyVariant,
} from "../atoms/typography/Typography.autogen";

const ClassEntityWrapper = styled.div<{ isActive: boolean }>`
  height: 120px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.isActive
      ? props.theme.colors.purpleLight
      : props.theme.colors.purpleBlack};
  padding: 12px;

  // all children color purpleBlack if isActive
`;

const DescWrapper = styled.div`
  margin-top: 8px;
  height: 80%;
  max-width: 70%;
  overflow: hidden;
  max-height: 100px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

interface ClassEntityProps {
  name: string | undefined;
  description: string | undefined;
  onClick?: () => void;
  isActive: boolean;
}

const ClassEntity: React.FC<ClassEntityProps> = ({
  name,
  description,
  onClick,
  isActive,
}) => {
  console.log(isActive, name, description);
  return (
    <ClassEntityWrapper onClick={onClick} isActive={isActive}>
      <Typography
        animated
        animationType="fade"
        variant={TypographyVariant.sectionHeader}
        highlight_level={
          isActive ? HighlightLevel.menuActive : HighlightLevel.neutral
        }
      >
        {name}
      </Typography>
      <DescWrapper>
        <Typography
          animated
          animationType="fade"
          variant={TypographyVariant.sectionDescription}
          highlight_level={
            isActive ? HighlightLevel.menuActive : HighlightLevel.neutral
          }
        >
          {description}
        </Typography>
      </DescWrapper>
    </ClassEntityWrapper>
  );
};

export default ClassEntity;
