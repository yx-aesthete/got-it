import React from "react";
import theme from "./theme";
import { ThemeProvider } from "styled-components";
import ClassList from "./components/pages/classesList/ClassList";
import { GlobalWrapper } from "./App.styles";
import ClassContainer from "./components/organisms/ClassContainer";
import { listOfClasses } from "./components/pages/classesList/ClassList.mock";
import { ClassProvider } from "./contexts/ClassContext";

function App() {
  //TODO  move to context but here for now
  const [isPresenting, setIsPresenting] = React.useState<string | null>(null);
  console.log("🚀 ~ App ~ isPresenting:", isPresenting);

  React.useEffect(() => {
    const activeClass = listOfClasses.find((classItem) => classItem.isActive);
    if (activeClass) {
      setIsPresenting(activeClass.name);
    } else {
      setIsPresenting("");
    }
  }, []);

  const isAnyClassActive = listOfClasses.some(
    (classItem) => classItem.isActive
  );

  return (
    <ThemeProvider theme={theme}>
      <ClassProvider>
        <GlobalWrapper>
          <ClassList />
          <ClassContainer />
        </GlobalWrapper>
      </ClassProvider>
    </ThemeProvider>
  );
}

export default App;
