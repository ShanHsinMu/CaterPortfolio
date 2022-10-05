import React from "react";
import styled from "styled-components";
import PreviewImageInput from "../../../utilis/EditLatouts/PreviewImageInput";
import EditText from "../../../utilis/EditLatouts/EditText";
import { resumeComContent } from "../Resume";
import useUpdateResumeData from "./ResumeUpdateDataFunction";
import { useMediaQuery } from "../../../utilis/useMediaQuery";

const Wrapper = styled.div`
  display: flex;
  width: 800px;
  margin: 0 auto;
  align-items: center;
  @media screen and (max-width: 1279px) {
    width: 71vw;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const Text1 = ({
  index,
  content,
}: {
  index: number;
  content: resumeComContent;
}) => {
  const { setReducerContent } = useUpdateResumeData({
    index,
    content,
  });
  const isRowBased0 = useMediaQuery("(min-width: 750px)");
  const isRowBased1 = useMediaQuery("(min-width: 370px)");
  const styleArr = [
    {
      width: isRowBased0 ? "525px" : "70vw",
      margin: "10px",
    },
    {
      width: isRowBased1 ? "255px" : "70vw",
      margin: "10px",
    },
  ];
  return (
    <Wrapper>
      {content.text.map((_, listIndex) => {
        return (
          <EditText
            key={listIndex}
            text={content.text[listIndex]}
            id={content.id}
            listIndex={listIndex}
            setReducerContent={setReducerContent}
            index={index}
            style={styleArr[listIndex]}
          />
        );
      })}
    </Wrapper>
  );
};

export default Text1;
