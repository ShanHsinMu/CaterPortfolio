import React from "react";
import styled from "styled-components";
import Canves from "../../../utilis/Canves";
import EditText from "../../../utilis/EditText";
import { portfolioComContent } from "../Portfolio";
import useUpdateResumeData from "./PortfolioUpdateDataFunction";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  width: 900px;
`;

const TextAndImg2 = ({
  content,
  index,
}: {
  content: portfolioComContent;
  index: number;
}) => {
  const { setReducerImage, setCanvasImage, setReducerText } =
    useUpdateResumeData({
      index,
      content,
    });
  return (
    <Wrapper>
      {content.image.map((_, listIndex) => {
        return (
          <EditText
            key={listIndex}
            text={content.text[listIndex]}
            id={content.id}
            listIndex={listIndex}
            setReducerText={setReducerText}
            index={index}
            style={{
              width: "250px",
              padding: " 0 10px",
              margin: "0 0 0 100px",
            }}
          />
        );
      })}
      {content.text.map((_, listIndex) => {
        return (
          <Canves
            key={listIndex}
            content={content}
            name={`${index}-${listIndex}`}
            size={{ height: 240, width: 440 }}
            setCanvasImage={setCanvasImage}
            // setReducerImage={setReducerImage}
            listIndex={listIndex}
            index={index}
          />
        );
      })}
    </Wrapper>
  );
};

export default TextAndImg2;
