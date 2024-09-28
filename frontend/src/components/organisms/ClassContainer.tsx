import React from "react";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { styled } from "styled-components";

const ClassContainerWrapper = styled.div`
  width: 66vw;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const IconContainer = styled.div`
  color: ${(props) => props.theme.colors.purpleLight};
  &:hover {
    cursor: pointer;
    color: white !important;
    transition: color 0.3s ease-in-out;
  }

  > svg {
    width: 80px;
    height: 80px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export default function ClassContainer({
  isPresenting,
}: {
  isPresenting: boolean;
}) {
  return (
    <ClassContainerWrapper>
      <IconWrapper>
        <IconContainer>
          {isPresenting ? <IoMdPause /> : <IoMdPlay />}
        </IconContainer>
      </IconWrapper>
      ClassContainer
    </ClassContainerWrapper>
  );
}
