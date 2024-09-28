import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { HighlightLevel, TypographyVariant } from './Typography.autogen';
import { TypographyContainer } from './Typography.styles';

interface TypographyProps {
  variant: TypographyVariant;
  highlight_level?: HighlightLevel;
  animated?: boolean;
  animationType?: 'fade' | 'write';
  capitalize?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  hoverColor?: string; // New prop for hover color
}
// Function to replace *text* with <b>text</b>
const processChildren = (children: React.ReactNode): React.ReactNode => {
  if (typeof children === 'string') {
    return children.split(/(\*[^*]+\*)/g).map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <b key={index}>{part.slice(1, -1)}</b>;
      }
      return part;
    });
  }
  return children;
};

export default function Typography(props: TypographyProps) {
  const { align, variant, highlight_level, animated, animationType, capitalize, onMouseEnter, onMouseLeave, children } = props;
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animated && textRef.current) {
      if (animationType === 'write' ) {
        const words = textRef.current.textContent?.split(' ') || [];
        textRef.current.innerHTML = words.map(word => 
          `<span class="word">${word.split('').map(char => 
            `<span class="char">${char}</span>`
          ).join('')}</span>`
        ).join(' ');

        const wordSpans = textRef.current.querySelectorAll('.word');
        const charSpans = textRef.current.querySelectorAll('.char');

        gsap.set(wordSpans, { opacity: 0 });
        gsap.set(charSpans, { opacity: 0 });

        gsap.to(wordSpans, {
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power1.inOut',
        });

        gsap.to(charSpans, {
          opacity: 1,
          duration: 0.05,
          stagger: 0.01,
          ease: 'power1.inOut',
        });
      } else if (animationType === 'fade') {
        gsap.fromTo(textRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });
      }
    }
  }, [animated, animationType]);

  return (
    <TypographyContainer
      align={props.align}
      ref={textRef}
      variant={variant}
      highlight_level={highlight_level || HighlightLevel.neutral}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      hoverColor={props.hoverColor}
    >
      {capitalize ? processChildren(children)?.toString()?.toUpperCase() : processChildren(children)}
    </TypographyContainer>
  );
}
