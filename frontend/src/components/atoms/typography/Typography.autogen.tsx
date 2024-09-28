import styled, { css } from 'styled-components';

const baseTypographyStyles = css`
  font-family: 'Montserrat', sans-serif;
`;

// source of truth for typography styles
export const typographyStyles = {
  supermicro: css`
    ${baseTypographyStyles}
    font-size: 6px;
    line-height: 6px;

    @media (max-width: 768px) {
      font-size: 10px;
      line-height: 10px;
    }
  `,
  micro: css`
    ${baseTypographyStyles}
    font-size: 14px;
    line-height: 16px;

    @media (max-width: 768px) {
      font-size: 12px;
      line-height: 14px;
    }
  `,
  megaHeader: css`
    font-family: 'Raleway', sans-serif;
    font-size: 36px;
    font-weight: 500;
    line-height: 56px;
    margin-block-end: 10px;
    box-sizing: border-box;
    display: block;

    @media (max-width: 768px 
      font-size: 34px;
      line-height: 36px;
    }

    @media (max-height: 800px) {
      font-size: 34px;
      line-height: 36px;
    }
  `,
  megaSubHeader: css`
    font-family: 'Raleway', sans-serif;
    font-size: 60px;
    line-height: 56px;
    font-weight: 700;
    margin-block-end: 10px;
    box-sizing: border-box;
    display: block;

    @media (max-width: 768px) {
      font-size: 56px;
      line-height: 58px;
    }

    @media (max-height: 800px) {
      font-size: 56px;
      line-height: 58px;
    }
  `,
  technical: css`
    font-family: 'Raleway', sans-serif;
    font-size: 28px;
    font-weight: 100;
    line-height: 22px;

    @media (max-width: 768px) {
      font-size: 20px;
      line-height: 24px;
    }

    @media (max-height: 800px) {
      font-size: 20px;
      line-height: 24px;
    }
  `,
  sectionHeader: css`
    ${baseTypographyStyles}
    font-size: 28px;
    line-height: 34px;
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 18px;
      line-height: 20px;
    }

    @media (max-height: 800px) {
      font-size: 20px;
      line-height: 24px;  
    }
  `,
  bigHeader: css`
    ${baseTypographyStyles}
    font-size: 32px;
    line-height: 36px;
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 32px;
      line-height: 36px;
      font-weight: 500;
    } 

    @media (max-height: 800px) {
      font-size: 32px;
      line-height: 36px;
      font-weight: 500;
    }
  `,
  sectionAcronymHugeHeader: css`
    font-family: 'Montserrat', sans-serif;
    font-size: 46px;
    line-height: 50px;
    font-weight: 300;

    @media (max-width: 768px) {
      font-size: 26px;
      line-height: 30px;
    }

    @media (max-height: 800px) {
      font-size: 26px;
      line-height: 30px;
    }
  `,
  sectionHeaderThin: css`
    ${baseTypographyStyles}
    font-size: 36px;
    line-height: 40px;
    font-weight: 100;

    @media (max-width: 768px) {
      font-size: 14px;
      line-height: 16px;
    }

    @media (max-height: 800px) {
      font-size: 14px;
      line-height: 16px;
    }
  `,
  sectionSubHeader: css`
    ${baseTypographyStyles}
    font-size: 22px;
    line-height: 28px;
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 16px;
      line-height: 18px;
    }

    @media (max-height: 800px) {
      font-size: 16px;
      line-height: 18px;
    }
  `,
  sectionSubHeaderSmallThick: css`
    ${baseTypographyStyles}
    font-size: 20px;
    line-height: 24px;
    font-weight: 800;

    @media (max-width: 768px) {
      font-size: 14px;
      line-height: 16px;
    }

    @media (max-height: 800px) {
      font-size: 14px;
      line-height: 16px;
    }
  `,
  sectionSubHeaderSmallThin: css`
    ${baseTypographyStyles}
    font-size: 18px;
    line-height: 22px;
    font-weight: 400;

    @media (max-width: 768px) {
      font-size: 14px;
      line-height: 16px;
    }

    @media (max-height: 800px) {
      font-size: 14px;
      line-height: 16px;
    }
  `,
  sectionSubHeaderExtraSmallThin: css`
    ${baseTypographyStyles}
    font-size: 18px;
    line-height: 22px;
    font-weight: 400;

    @media (max-width: 768px) {
      font-size: 12px;
      line-height: 14px;
    }

    @media (max-height: 800px) {
      font-size: 14px;
      line-height: 16px;
    }
  `,
  sectionDescription: css`
    ${baseTypographyStyles}
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 14px;
      line-height: 16px;
    }

    @media (max-height: 800px) {
      font-size: 14px;
      line-height: 16px;
    }
  `,
};

export enum TypographyVariant {
  supermicro = 'supermicro',
  micro = 'micro',
  megaHeader = 'megaHeader',
  megaSubHeader = 'megaSubHeader',
  technical = 'technical',
  sectionHeader = 'sectionHeader',
  bigHeader = 'bigHeader',
  sectionAcronymHugeHeader = 'sectionAcronymHugeHeader',
  sectionSubHeaderSmallThin = 'sectionSubHeaderSmallThin',
  sectionSubHeaderExtraSmallThin = 'sectionSubHeaderExtraSmallThin',
  sectionSubHeaderSmallThick = 'sectionSubHeaderSmallThick',
  sectionHeaderThin = 'sectionHeaderThin',
  sectionSubHeader = 'sectionSubHeader',
  sectionDescription = 'sectionDescription',
}

export enum HighlightLevel {
  active = 'active',
  menuActive = 'menuActive',
  highlighted = 'highlighted',
  inactive = 'inactive',
  neutral = 'neutral',
  warning = 'warning',
}
