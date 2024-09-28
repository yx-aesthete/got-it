import React from "react";
import theme from "./theme";
import { ThemeProvider } from "styled-components";
import ClassList from "./components/pages/classesList/ClassList";
import { GlobalWrapper } from "./App.styles";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalWrapper>
        <ClassList />
      </GlobalWrapper>
    </ThemeProvider>
  );
}

export default App;
