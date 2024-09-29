import React, { useEffect, useRef } from "react";
import { FaShareSquare } from "react-icons/fa";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { styled } from "styled-components";
import gsap from "gsap";

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

export default function ControlIcons({
  isPresenting,
  isEditing,
  handlePresenting,
  handleEditing,
  handleSharing,
}: ControlIconsProps) {
  // Refs for each icon to animate their transitions
  const presentingIconRef = useRef<HTMLDivElement>(null);
  const editingIconRef = useRef<HTMLDivElement>(null);
  const sharingIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      presentingIconRef.current &&
      editingIconRef.current &&
      sharingIconRef.current
    ) {
      // Apply staggered animation on initial load
      gsap.fromTo(
        [
          presentingIconRef.current,
          editingIconRef.current,
          sharingIconRef.current,
        ],
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, stagger: 0.2, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []); // Runs once on mount

  // Animation for changing icons
  const animateIconChange = (iconRef: React.RefObject<HTMLDivElement>) => {
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  };

  return (
    <ControlIconsWrapper>
      <IconWrapper ref={presentingIconRef}>
        <IconContainer
          onClick={() => {
            handlePresenting();
            animateIconChange(presentingIconRef);
          }}
        >
          {isPresenting ? <IoMdPause /> : <IoMdPlay />}
        </IconContainer>
      </IconWrapper>
      <IconWrapper ref={editingIconRef}>
        <IconContainer
          onClick={() => {
            handleEditing();
            animateIconChange(editingIconRef);
          }}
        >
          {isEditing ? <TiTick /> : <MdEdit />}
        </IconContainer>
      </IconWrapper>
      <IconWrapper ref={sharingIconRef}>
        <IconContainer
          onClick={() => {
            handleSharing();
            animateIconChange(sharingIconRef);
          }}
        >
          <FaShareSquare />
        </IconContainer>
      </IconWrapper>
    </ControlIconsWrapper>
  );
}
