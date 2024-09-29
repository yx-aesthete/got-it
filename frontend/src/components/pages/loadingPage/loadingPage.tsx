import React from "react";
import { ThreeDots } from "react-loader-spinner";
import styled from "styled-components";

const AbsoluteLoader = styled.div``;

const AbsoluteLoaderWrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(1, 1, 1, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function LoadingPage() {
  return (
    <AbsoluteLoaderWrapper>
      <AbsoluteLoader>
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#dc4a6c"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </AbsoluteLoader>
    </AbsoluteLoaderWrapper>
  );
}
