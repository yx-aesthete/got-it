import React from "react";
import ClassList from "./components/pages/classesList/ClassList";
import theme from "./theme";
import { ThemeProvider } from "styled-components";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ClassList />
    </ThemeProvider>
  );
}

export default App;
