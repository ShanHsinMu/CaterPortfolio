import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { RootState } from "../../reducers";
import { useSelector, useDispatch } from "react-redux";
import {
  resumeAddCom,
  resumeDeleteCom,
  resumeLoading,
  resumeAddSetting,
  isPreviewResume,
  isPreviewTrue,
} from "../../action";

import firebase from "../../utilis/firebase";
import ResumeCom1 from "./ResumeComponents/ResumeCom1";
import ResumeCom2 from "./ResumeComponents/ResumeCom2";
import ResumeCom3 from "./ResumeComponents/ResumeCom3";
import Delete from "./Delete";
import AddComArea from "./AddComArea";
import SideBar from "../../utilis/SideBar";
import preImage from "../../utilis/cat.jpg";
import { Type } from "typescript";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 120px;
`;

const ResumeEditor = styled.div`
  position: relative;
  width: 960px;
  margin: 60px auto;
  border: 1px solid;
  border-radius: 15px;
  padding: 20px 40px;
`;

const PreviewDiv = styled.div`
  position: absolute;
  /* border: 1px solid; */
  width: 900px;
  height: 100%;
  z-index: 2;
`;

const ResumeHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SineleComponent = styled.div`
  display: flex;
`;

const ToProfileLink = styled(Link)``;

export interface resumeComContent {
  image: string[];
  text: string[];
  type: number;
  comName: string;
}

export const resumeChoice = [
  {
    name: 0,
    comIndex: 0,
    comContent: {
      image: [preImage],
      text: ["<h2>姓名</h2><p>Email</p><p>聯絡資訊</p>"],
      type: 0,
      comName: "Text",
    },
  },
  {
    name: 1,
    comIndex: 1,
    comContent: {
      image: [preImage, preImage, preImage],
      text: [],
      type: 1,
      comName: "Text",
    },
  },
  {
    name: 2,
    comIndex: 2,
    comContent: {
      image: [],
      text: [
        "<h3>標題</h3><p>您的英勇事蹟</p><p>您的英勇事蹟</p>",
        "<h3>標題</h3><p>您的英勇事蹟</p><p>您的英勇事蹟</p>",
      ],
      type: 2,
      comName: "Text",
    },
  },
];

const Resume: React.FC = () => {
  const [resumeCom, setResumeCom] = useState<resumeComContent[]>([]);
  const refPhoto = useRef<HTMLDivElement>(null);
  const resumeID = useParams().id;
  const resumeData = useSelector((state: RootState) => state.ResumeReducer);
  let isPreview = useSelector(
    (state: RootState) => state.IsPreviewReducer.resume
  );
  const userData = useSelector((state: RootState) => state.UserReducer);
  const dispatch = useDispatch();

  const addResumeCom = (conIndex: number) => {
    dispatch(resumeAddCom(resumeChoice[conIndex].comContent));
    setResumeCom([...resumeCom, resumeChoice[conIndex].comContent]);
  };

  const addDeleteCom = (deleteIndex: number) => {
    dispatch(resumeDeleteCom(deleteIndex));
    const tempArr = [...resumeCom];
    tempArr.splice(deleteIndex, 1);
    console.log(tempArr);
    setResumeCom(tempArr);
  };
  const uploadResume = async () => {
    firebase.uploadDoc("resumes", `${resumeID}`, resumeData);
  };
  const getCoverImage = () => {
    html2canvas(refPhoto.current!).then(function (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      console.log(dataUrl);
      dispatch(resumeAddSetting("coverImage", dataUrl));
    });
  };

  useEffect(() => {
    const loadResume = async () => {
      const resumeData = await firebase.readData("resumes", `${resumeID}`);
      if (resumeData) {
        dispatch(resumeLoading(resumeData));
        const tempArr: resumeComContent[] = [];
        resumeData.content.forEach(
          (content: {
            image: string[];
            text: string[];
            type: number;
            comName: string;
          }) => {
            tempArr.push(content);
          }
        );
        setResumeCom(tempArr);
      } else {
        dispatch(resumeAddSetting("name", userData.name));
        dispatch(resumeAddSetting("userID", userData.userID));
      }
    };
    loadResume();
  }, [userData]);

  const ResumeComponents = {
    Text: function Text({
      index,
      content,
    }: {
      index: number;
      content: resumeComContent;
    }) {
      return <ResumeCom1 index={index} content={content} />;
    },
  };

  return (
    <>
      <Wrapper>
        {resumeID === userData.userID ? (
          <button
            onClick={() => {
              dispatch(isPreviewResume());
            }}
          >
            編輯/預覽
          </button>
        ) : null}

        <ResumeEditor ref={refPhoto}>
          <PreviewDiv style={{ zIndex: isPreview ? "2" : "-1" }}></PreviewDiv>
          <ResumeHeader>
            {resumeCom?.map((content, index) => {
              const TempCom =
                ResumeComponents[
                  content.comName as keyof typeof ResumeComponents
                ];
              console.log(TempCom);
              return (
                <SineleComponent key={index}>
                  <TempCom index={index} content={content} />
                  <Delete addDeleteCom={addDeleteCom} index={index} />
                </SineleComponent>
              );
              // switch (content.type) {
              //   case 0: {
              //     return (
              //       <SineleComponent key={index}>
              //         <ResumeCom1 index={index} content={content} />
              //         {isPreview ? null : (
              //           <Delete addDeleteCom={addDeleteCom} index={index} />
              //         )}
              //       </SineleComponent>
              //     );
              //   }
              //   case 1: {
              //     return (
              //       <SineleComponent key={index}>
              //         <ResumeCom2 index={index} content={content} />
              //         {isPreview ? null : (
              //           <Delete addDeleteCom={addDeleteCom} index={index} />
              //         )}
              //       </SineleComponent>
              //     );
              //   }
              //   case 2: {
              //     return (
              //       <SineleComponent key={index}>
              //         <ResumeCom3 index={index} content={content} />
              //         {isPreview ? null : (
              //           <Delete addDeleteCom={addDeleteCom} index={index} />
              //         )}
              //       </SineleComponent>
              //     );
              //   }
              //   default:
              //     return null;
              // }
            })}
          </ResumeHeader>
        </ResumeEditor>
        <AddComArea addResumeCom={addResumeCom} uploadResume={uploadResume} />
        <div
          onClick={() => {
            getCoverImage();
            dispatch(isPreviewTrue("resume"));
          }}
        >
          確定完成編輯? 預覽看看吧
        </div>
        <ToProfileLink to={`/profile`}>profile</ToProfileLink>
      </Wrapper>
      <SideBar type={"resume"} data={resumeData} />
    </>
  );
};

export default Resume;
