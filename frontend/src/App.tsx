import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import theme from "./theme";
import { ThemeProvider } from "styled-components";
import { GlobalWrapper } from "./App.styles";
import { listOfClasses } from "./components/organisms/classesList/ClassList.mock";
import { ClassProvider } from "./contexts/ClassContext";
import VotingPage from "./components/pages/VotingPage";
import Classes from "./components/pages/classes/Classes";
import ParticipantPage from "./components/pages/participant/ParticipantPage";

function App() {
  // TODO: Move to context but here for now
  const [isPresenting, setIsPresenting] = React.useState<string | null>(null);
  console.log("🚀 ~ App ~ isPresenting:", isPresenting);

  React.useEffect(() => {
    const activeClass = listOfClasses.find(
      (classItem: any) => classItem.isActive
    );
    if (activeClass) {
      setIsPresenting(activeClass.name);
    } else {
      setIsPresenting(null);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ClassProvider>
          <GlobalWrapper>
            <Routes>
              {/* Tutor Routes */}
              <Route path="/tutor/classes" element={<Classes />} />

              {/* Participant Routes */}
              <Route
                path="/participant/class/:number"
                element={<ParticipantPage />}
              />

              {/* Shared Routes */}
              <Route path="/vote" element={<VotingPage />} />
              <Route path="/" element={<VotingPage />} />
            </Routes>
          </GlobalWrapper>
        </ClassProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
