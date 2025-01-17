import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpDownLeftRight,
  faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

import { RootState } from "../../reducers";
import {
  websiteAddCom,
  websiteDeleteCom,
  websiteRenewContent,
  websiteLoading,
} from "../../action/WebsiteReducerAction";
import {
  isPreviewTrue,
  isPreviewFalse,
  setAlert,
} from "../../action/IsPreviewReducerAction";
import { WebsiteComponents } from "./websiteComponents";

import firebase from "../../utilis/firebase";
import Loading from "../../utilis/usefulComponents/Loading";
import PreviewBtn from "../../utilis/usefulComponents/PreviewBtn";
import AddWebsiteCom from "./AddWebsiteCom";
import Delete from "../Resume/Delete";
import PopUp from "../../utilis/usefulComponents/PopUp";
import QusetionMark, {
  introSteps,
} from "../../utilis/usefulComponents/QusetionMark";
import WebsiteInitialSetup from "./WebsiteInitialSetup";
import LargeLoading from "../../utilis/usefulComponents/LargeLoading";
import { websiteChoice } from "./websiteComponents";
import useAlertCalling from "../../components/useAlertCalling";
import {
  EditPageWrapper,
  LinkButton,
  UploadButton,
  MoveBtn,
  PreviewDiv,
  SingleComponentUnit,
  EditContentLayout,
} from "../../utilis/styledExtending";

const WebsiteEditContentLayouts = styled(EditContentLayout)`
  width: 960px;
  @media screen and (max-width: 1279px) {
    width: 100%;
  }
`;

const WebsitePreviewDiv = styled(PreviewDiv)`
  width: 900px;
  @media screen and (max-width: 1279px) {
    width: 100%;
  }
`;

const WebsiteUploadBtn = styled(UploadButton)`
  background-color: #ffffff;
  width: 150px;
  margin: 40px auto 20px;
`;

export interface websiteComContent {
  image: string[];
  text: string[];
  comName: string;
  id: string;
  portfolioID?: string[];
}

const Website = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLargeLoading, setIsLargeLoading] = useState<boolean>(false);
  const deletePortfolioContent = useRef<number>();
  const websiteID = useParams().id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const websiteData = useSelector((state: RootState) => state.WebsiteReducer);
  const userData = useSelector((state: RootState) => state.UserReducer);
  const isPreview = useSelector(
    (state: RootState) => state.IsPreviewReducer.website
  );
  const { portfolioListPopup } = useSelector(
    (state: RootState) => state.IsPreviewReducer
  );

  const { startAlert } = useAlertCalling();

  const addWebsiteCom = (conIndex: number) => {
    dispatch(websiteAddCom(websiteChoice[conIndex]));
  };

  const addDeleteCom = (deleteIndex: number) => {
    dispatch(websiteDeleteCom(deleteIndex));
  };

  const sureToDelete = (isSure: boolean) => {
    if (isSure) {
      deletePortCom(deletePortfolioContent.current!);
    }
    dispatch(isPreviewFalse("portfolioListPopup"));
  };

  const deletePortCom = async (deleteIndex: number) => {
    let deletePromiswArr: Promise<void>[] = [];
    websiteData.content[deleteIndex].portfolioID.forEach(
      (portfolioID: string) => {
        deletePromiswArr.push(deleteDoc(doc(db, "portfolios", portfolioID)));
      }
    );
    await Promise.all(deletePromiswArr);

    dispatch(websiteDeleteCom(deleteIndex));
    const tempContentArr = [...websiteData.content];
    tempContentArr.splice(deleteIndex, 1);
    const newResumeData = { ...websiteData, content: tempContentArr };
    firebase.uploadDoc("websites", userData.userID, newResumeData);
  };

  const uploadWebsite = async () => {
    const tempData = { ...websiteData };
    tempData.time = Date.now();
    try {
      await firebase.uploadDoc("websites", `${websiteID}`, tempData);
      startAlert("成功更新網站!");
    } catch (e) {
      startAlert("網站更新失敗!");
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items: websiteComContent[] = [...websiteData.content];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(websiteRenewContent(items));
  };

  useEffect(() => {
    setIsLoading(true);
    const loadWebsite = async () => {
      const websiteData = await firebase.readData("websites", `${websiteID}`);
      if (websiteData) {
        dispatch(websiteLoading(websiteData));
      } else {
        if (websiteID !== userData.userID) {
          startAlert("查無結果，請確定網址輸入正確");
          navigate(`/`);
        } else {
          dispatch(
            websiteLoading({
              title: "",
              coverImage: "",
              content: [],
              name: userData.name,
              followers: [],
              userID: userData.userID,
              userImage: userData.userImage,
            })
          );
        }
      }
      setIsLoading(false);
    };
    loadWebsite();
    return () => {
      dispatch(isPreviewTrue("website"));
    };
  }, [userData, websiteID]);

  return (
    <EditPageWrapper>
      {isPreview ? null : (
        <WebsiteInitialSetup setIsLargeLoading={setIsLargeLoading} />
      )}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="characters">
          {(provided) => (
            <WebsiteEditContentLayouts
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <WebsitePreviewDiv
                style={{ zIndex: isPreview ? "2" : "-1" }}
              ></WebsitePreviewDiv>
              {isLoading ? <Loading /> : null}
              {websiteData.content.length === 0 ? <p>尚未建立網站</p> : null}
              {websiteData.content?.map(
                (content: websiteComContent, index: number) => {
                  const TempCom =
                    WebsiteComponents[
                      content.comName as keyof typeof WebsiteComponents
                    ];
                  return (
                    <Draggable
                      key={content.id}
                      draggableId={content.id}
                      index={index}
                    >
                      {(provided) => (
                        <SingleComponentUnit
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <TempCom
                            index={index}
                            content={content}
                            userID={userData.userID}
                          />
                          <Delete
                            addDeleteCom={
                              content.comName === "Portfolio0"
                                ? () => {
                                    deletePortfolioContent.current = index;
                                    dispatch(
                                      isPreviewTrue("portfolioListPopup")
                                    );
                                  }
                                : addDeleteCom
                            }
                            index={index}
                          />
                          <PopUp
                            isPopup={portfolioListPopup}
                            text={
                              "是否確定要刪除此作品集列? 一旦刪除將無法回復"
                            }
                            sureToDelete={sureToDelete}
                          ></PopUp>
                          <MoveBtn {...provided.dragHandleProps}>
                            {isPreview ? null : (
                              <FontAwesomeIcon icon={faUpDownLeftRight} />
                            )}
                          </MoveBtn>
                        </SingleComponentUnit>
                      )}
                    </Draggable>
                  );
                }
              )}
              {provided.placeholder}
            </WebsiteEditContentLayouts>
          )}
        </Droppable>
      </DragDropContext>
      {isPreview ? null : (
        <AddWebsiteCom
          addWebsiteCom={addWebsiteCom}
          uploadWebsite={uploadWebsite}
        />
      )}

      {isPreview ? null : (
        <WebsiteUploadBtn
          onClick={() => {
            dispatch(isPreviewTrue("website"));
            uploadWebsite();
          }}
          className="websiteUpload"
        >
          將網站儲存上架!
        </WebsiteUploadBtn>
      )}
      <LinkButton to={`/profile/${websiteID}`} id="websiteToProfile">
        <FontAwesomeIcon
          icon={faUserAstronaut}
          style={{ marginRight: "10px" }}
        />
        前往{websiteData.name}的個人頁面
      </LinkButton>

      {websiteID === userData.userID ? (
        <PreviewBtn isPreview={isPreview} id={"websitePreviewBtn"} />
      ) : null}
      <QusetionMark
        stepType={
          websiteID === userData.userID
            ? introSteps.websiteUser
            : introSteps.websiteOthers
        }
        type={websiteID === userData.userID ? "website" : ""}
      />
      {isLargeLoading ? <LargeLoading backgroundColor={"#ffffffb3"} /> : null}
    </EditPageWrapper>
  );
};

export default Website;
