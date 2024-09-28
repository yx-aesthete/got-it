import styled, { css } from 'styled-components';
import { HighlightLevel, typographyStyles } from './Typography.autogen';

interface TypographyContainerProps {
  variant: string;
  highlight_level: HighlightLevel;
  align?: 'left' | 'center' | 'right';
  hoverColor?: string;
}

const highlightStyles = (props: TypographyContainerProps) => {
  const { highlight_level } = props;
  switch (highlight_level) {
    case 'active':
      return css`
        color: ${({ theme }) => theme.colors.whitePrimary};
      `;
    case 'highlighted':
      return css`
        color: ${({ theme }) => theme.colors.whiteMidPrimary};
      `;
    case 'inactive':
      return css`
        color: ${({ theme }) => theme.colors.whiteLight};
      `;
    case 'neutral':
      return css`
        color: ${({ theme }) => theme.colors.whitePrePrimary};
      `;
    case 'warning':
      return css`
        color: ${({ theme }) => theme.colors.warning};
      `;
    default:
      return css`
        color: ${({ theme }) => theme.colors.whitePrePrimary};
      `;
  }
};

const TypographyContainer = styled.div<TypographyContainerProps>`
  ${({ variant }) => typographyStyles[variant as keyof typeof typographyStyles]};
  ${({ highlight_level }) => highlightStyles({ highlight_level, variant: '' })};
  transition: color 0.3s ease-in-out; // Update the transition timing and duration
  text-align: ${({ align }) => align || 'left'};

  ${({ hoverColor }) =>
    hoverColor &&
    css`
      &:hover {
        color: ${hoverColor};
      }
    `}
`;

export { TypographyContainer };

export const ParagraphWrapper = styled.div`
  display: inline-block;
  align-items: left;
  margin: 12px 12px 0px 12px;
  padding-bottom: 12px;
  justify-content: left;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 150px;
  }

`;
