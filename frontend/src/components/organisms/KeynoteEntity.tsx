import React from "react";
import styled from "styled-components";
import Typography from "../atoms/typography/Typography";
import {
  HighlightLevel,
  TypographyVariant,
} from "../atoms/typography/Typography.autogen";

const KeynoteEntityWrapper = styled.div<{
  isActive: boolean;
  height: number;
  isodd: boolean;
  hasBeenCompleted: boolean;
}>`
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  height: ${(props) => props.height}px;
  background-color: ${(props) =>
    props.isActive
      ? props.theme.colors.lightBlue
      : props.isodd
      ? props.theme.colors.pinkLight
      : props.theme.colors.pinkDark};
  padding: 12px;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
`;

interface KeynoteEntityProps {
  title: string;
  isActive: boolean;
  hasBeenCompleted: boolean;
  height: number;
  isodd: boolean;
  index: number;
}

const KeynoteEntity: React.FC<KeynoteEntityProps> = ({
  title,
  hasBeenCompleted,
  isActive,
  height,
  isodd,
  index,
}) => {
  console.log("🚀 ~ height:", height)
  return (
    <KeynoteEntityWrapper isodd={isodd} isActive={isActive} height={height}>
      <ContentWrapper>
        <Typography
          animated
          animationType="fade"
          variant={TypographyVariant.sectionDescription}
          highlight_level={
            isActive ? HighlightLevel.menuActive : HighlightLevel.neutral
          }
        >
          {title}
        </Typography>
      </ContentWrapper>
    </KeynoteEntityWrapper>
  );
};

export default KeynoteEntity;
