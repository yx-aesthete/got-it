const theme: Theme = {
  colors: {
    // Primary colors
    primary: "#D9D9D9",
    secondary: "#5D5B5B",
    background: "#000000",

    // White primary
    whitePrimary: "#FFFFFF", // text color hover
    whiteMidPrimary: "#FFFFFFBD", // text color offset
    whitePrePrimary: "#FFFFFF90", // text color offset
    whiteMedium: "#FFFFFF80", // text color offset
    whiteLight: "#FFFFFF60", // text color inactive
    whiteMidLight: "#FFFFFF45", // text color inactive

    warning: "#9F0A0AC4",
    accentGreen: "#65E09F",

    // got-it palette
    pinkDark: "#dc4a6c",
    pinkLight: "#dc4a6c",
    salmonDark: "#ff9294",
    salmonLight: "#F6B4B0FF",
    purpleLight: "#D5B5E7FF",
    purpleMid: "#423358",
    purpleDark: "#45294f",
    purpleBlack: "#151319",

    blueLight: "#6094FA",
    redLight: "##FF675E",

    // Grey primary
    greyPrimary: "#D9D9D9",
    greyMidPrimary: "#D9D9D9B0",
    greyPrimary5: "#D9D9D905", // TODO bg icon in menu item
    greyPrimary10: "#D9D9D910",
    greyPrimary15: "#D9D9D915", // lvl 1 gradient
    greyPrimary20: "#D9D9D920", // lvl 2 gradient - bg menu item
    greyPrimary25: "#D9D9D925", // lvl 3 gradient
    greyPrimary30: "#D9D9D930", // lvl 4 gradient
    greyPrimary35: "#D9D9D935",
    greyPrimary40: "#D9D9D940",

    bgGreyLight: "#5D5B5B10",
    bgGreyPrimary: "#5D5B5B20",
    bgGreyDark: "#5D5B5B40",

    greyLight: "#D9D9D940",
    greyDark: "#131313",
  },
  fonts: {
    primary: "Montserrat, sans-serif",
    menu: "Montserrat, 36px, regular",
  },
};

type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  whitePrimary: string;
  whiteMidPrimary: string;
  whitePrePrimary: string;
  whiteMedium: string;
  whiteLight: string;
  whiteMidLight: string;
  warning: string;
  accentGreen: string;
  greyPrimary: string;
  greyMidPrimary: string;
  greyPrimary5: string;
  greyPrimary10: string;
  greyPrimary15: string;
  pinkDark: string;
  pinkLight: string;
  salmonDark: string;
  salmonLight: string;
  purpleLight: string;
  blueLight:string;
  redLight:string;
  purpleMid: string;
  purpleDark: string;
  purpleBlack: string;
  greyPrimary20: string;
  greyPrimary25: string;
  greyPrimary30: string;
  greyPrimary35: string;
  greyPrimary40: string;
  bgGreyLight: string;
  bgGreyPrimary: string;
  bgGreyDark: string;
  greyLight: string;
  greyDark: string;
};

type ThemeFonts = {
  primary: string;
  menu: string;
};

type Theme = {
  colors: ThemeColors;
  fonts: ThemeFonts;
};

export default theme;
