import React from "react";
import styled from "styled-components";
import Typography from "../atoms/typography/Typography";
import {
  HighlightLevel,
  TypographyVariant,
} from "../atoms/typography/Typography.autogen";

const ClassEntityWrapper = styled.div`
  height: 120px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.purpleBlack};
  padding: 12px;
`;

interface ClassEntityProps {
  name: string;
  description: string;
}

const ClassEntity: React.FC<ClassEntityProps> = ({ name }) => {
  return (
    <ClassEntityWrapper>
      <Typography
        animated
        animationType="fade"
        variant={TypographyVariant.sectionHeader}
        highlight_level={HighlightLevel.active} // or any appropriate default value
      >
        {name}
      </Typography>
      <Typography
        animated
        animationType="fade"
        variant={TypographyVariant.sectionDescription}
        highlight_level={HighlightLevel.active} // or any appropriate default value
      >
        {name}
      </Typography>
    </ClassEntityWrapper>
  );
};

export default ClassEntity;
