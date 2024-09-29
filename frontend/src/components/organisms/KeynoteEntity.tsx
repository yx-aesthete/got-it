import React from "react";
import styled from "styled-components";
import Typography from "../atoms/typography/Typography";
import {
  HighlightLevel,
  TypographyVariant,
} from "../atoms/typography/Typography.autogen";

const KeynoteEntityWrapper = styled.div<{ isActive: boolean; heightPercentage: number }>`
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.isActive
      ? props.theme.colors.purpleLight
      : props.theme.colors.purpleBlack};
  padding: 12px;
  position: relative;
  overflow: hidden;
  height: ${({ heightPercentage }) => `${heightPercentage}%`}; 

  &:hover {
    height: ${({ heightPercentage }) => `${heightPercentage + 100}%`}; 
  }
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
  heightPercentage: number;
  index: number;
}

const KeynoteEntity: React.FC<KeynoteEntityProps> = ({
  title,
  isActive,
  heightPercentage,
  index,
}) => {
  return (
    <KeynoteEntityWrapper
      isActive={isActive}
      heightPercentage={heightPercentage}
    >
      <ContentWrapper>
        <Typography
          animated
          animationType="fade"
          variant={TypographyVariant.sectionHeader}
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
