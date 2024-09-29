import React from "react";
import ClassContainer from "../../organisms/ClassContainer";
import ClassList from "../../organisms/classesList/ClassList";
import useData from "../../../hooks/UseData";
import LoadingPage from "../loadingPage/loadingPage";

export default function Classes() {
  const { isLoading, classes } = useData();
  console.log("🚀 ~ Classes ~ classes:", classes);

  return (
    <>
      <ClassList classes={classes} />
      <ClassContainer />
      {isLoading && <LoadingPage />}
    </>
  );
}
