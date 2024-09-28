import React from 'react'
import { FaShareSquare } from 'react-icons/fa';
import { IoMdPause, IoMdPlay } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import { styled } from 'styled-components';
import { TiTick } from "react-icons/ti";

const ControlIconsWrapper = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const IconContainer = styled.div<{ reduced?: boolean }>`
  color: ${(props) => props.theme.colors.purpleLight};
  &:hover {
    cursor: pointer;
    color: white !important;
    transition: color 0.3s ease-in-out;
  }

  display: flex;
  justify-content: center;
  align-items: center;

  > svg {
    width: 80px;
    height: 80px;
    padding: 12px;
  }
`;

const IconWrapper = styled.div`
  width: fit-content;
  display: flex;
  margin-left: auto;
  background-color: ${(props) => props.theme.colors.purpleMid};
`;

export interface ControlIconsProps {
    isPresenting: boolean;
    isEditing: boolean;
    isSharing: boolean;
    handlePresenting: () => void;
    handleEditing: () => void;
    handleSharing: () => void;
}


export default function ControlIcons({ isPresenting, isEditing, isSharing, handlePresenting, handleEditing, handleSharing }: ControlIconsProps) {
    return (
      <ControlIconsWrapper>
        <IconWrapper>
          <IconContainer onClick={handlePresenting}>
            {isPresenting ? <IoMdPause /> : <IoMdPlay />}
          </IconContainer>
        </IconWrapper>
        <IconWrapper>
          <IconContainer onClick={handleEditing}>
            {isEditing ? <TiTick /> : <MdEdit />}
          </IconContainer>
        </IconWrapper>
        <IconWrapper>
          <IconContainer onClick={handleSharing}>
            <FaShareSquare />
          </IconContainer>
        </IconWrapper>
      </ControlIconsWrapper>
    );
}
