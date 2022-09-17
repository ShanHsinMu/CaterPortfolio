import React, { useRef, useState } from "react";
import styled from "styled-components";
import Canves from "../../../utilis/Canves";
import EditText from "../../../utilis/EditText";
import { websiteComContent } from "../Website";
import useUpdateResumeData from "./WebsiteUpdateDataFunction";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 960px;
`;

const WebsiteCom1 = ({
  content,
  index,
}: {
  content: websiteComContent;
  index: number;
}) => {
  const { imageFileList, textList, setReducerImage, setReducerText } =
    useUpdateResumeData({ index, content });
  return (
    <Wrapper>
      {imageFileList.map((_, listIndex) => {
        return (
          <Canves
            key={listIndex}
            content={content}
            name={index.toString()}
            size={{ height: 200, width: 200 }}
            setReducerImage={setReducerImage}
            listIndex={listIndex}
            style={{
              margin: "0 auto",
            }}
          />
        );
      })}
      {textList.map((_, listIndex) => {
        return (
          <EditText
            key={listIndex}
            text={content.text[listIndex]}
            listIndex={listIndex}
            setReducerText={setReducerText}
          />
        );
      })}
    </Wrapper>
  );
};

export default WebsiteCom1;
