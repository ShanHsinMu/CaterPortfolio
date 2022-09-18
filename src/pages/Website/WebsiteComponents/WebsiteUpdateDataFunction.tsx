import React, { useState } from "react";
import firebase from "../../../utilis/firebase";
import { useDispatch } from "react-redux";
import { websiteAddImage, websiteFillContent } from "../../../action";
import { websiteComContent } from "../Website";

function useUpdateResumeData({
  index,
  content,
}: {
  index: number;
  content: websiteComContent;
}) {
  const [imageFileList, setImageFileList] = useState<string[]>(content.image);
  const [textList, setTextList] = useState<string[]>(content.text);
  const diapatch = useDispatch();
  const setReducerImage = async (JSONstring: string, listIndex: number) => {
    const tempArr = [...imageFileList];
    tempArr[listIndex] = JSONstring;
    setImageFileList(tempArr);
    diapatch(websiteAddImage(index, tempArr));
  };

  const setReducerText = async (text: string, listIndex: number) => {
    const tempArr = [...textList];
    tempArr[listIndex] = text;
    setTextList(tempArr);
    diapatch(websiteFillContent(index, tempArr));
  };

  return {
    imageFileList: imageFileList,
    textList: textList,
    setReducerImage: setReducerImage,
    setReducerText: setReducerText,
  };
}

export default useUpdateResumeData;
