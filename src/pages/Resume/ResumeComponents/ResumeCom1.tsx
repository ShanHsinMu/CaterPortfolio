import React, { useState } from "react";
import PreviewImageInput from "../../../utilis/PreviewImageInput";
import EditText from "../../../utilis/EditText";
import firebase from "../../../utilis/firebase";
import { useDispatch } from "react-redux";
import { resumeAddImage } from "../../../action";

const ResumeCom1 = ({ index }: { index: number }) => {
  const [imageFileList, setImageFileList] = useState<string[] | null[]>([null]);
  const diapatch = useDispatch();
  const setResumeReducerImage = async (file: File, listIndex: number) => {
    const tempArr = imageFileList;
    const imageUrl = await firebase.getImageUrl(file);
    tempArr[listIndex] = imageUrl;
    setImageFileList(tempArr);
    diapatch(resumeAddImage(index, tempArr));
  };
  return (
    <div>
      {imageFileList.map((_, index) => {
        return (
          <PreviewImageInput
            key={index}
            imageFileList={imageFileList}
            setImageFileList={setImageFileList}
            setResumeReducerImage={setResumeReducerImage}
            listIndex={index}
          />
        );
      })}
      <EditText
        type={"resume"}
        text={"<h2>姓名</h2><p>Email</p><p>聯絡資訊</p>"}
      />
    </div>
  );
};

export default ResumeCom1;