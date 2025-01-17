import React, { useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faTrash } from "@fortawesome/free-solid-svg-icons";

import { RootState } from "../../../reducers";
import { websiteComContent } from "../Website";
import {
  websiteChangePortfolioID,
  websiteAddImage,
  websiteChangeText,
} from "../../../action/WebsiteReducerAction";
import {
  isPreviewTrue,
  isPreviewFalse,
} from "../../../action/IsPreviewReducerAction";
import {
  setPortfolioIndex,
  setPortfolioListIndex,
} from "../../../action/PortfolioListIndexReducerAction";

import firebase from "../../../utilis/firebase";
import PopUp from "../../../utilis/usefulComponents/PopUp";

const Wrapper = styled.div`
  display: flex;
  width: 900px;
  flex-wrap: wrap;
  margin: 0 auto;
  z-index: 3;
  justify-content: flex-start;
  @media screen and (max-width: 1079px) {
    width: 600px;
    flex-wrap: wrap;
  }
  @media screen and (max-width: 699px) {
    width: 300px;
    flex-wrap: wrap;
  }
`;

const PortfolioShowing = styled.div`
  position: relative;
  display: flex;
  width: 300px;
  justify-content: center;
`;

const PortfolioCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  text-decoration: none;
  width: 210px;
  margin: 20px 5px;
  border: 1px solid #555555;
  border-radius: 15px;
  overflow: hidden;
`;

const PortfolioImg = styled.div<{ img: string }>`
  width: 210px;
  height: 210px;
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-position: center;
  margin: 10px 0;
  transition: scale 0.5s;
  &:hover {
    scale: 1.1;
  }
`;

const PortfolioTitle = styled.p`
  color: #555555;
  font-size: 20px;
  margin: 5px 20px;
`;

const DeleteBtn = styled.div`
  position: absolute;
  font-size: 18px;
  color: #6d6d6d;
  top: 30px;
  right: 15px;
  cursor: pointer;
`;

const AddingPortfolio = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 240px;
  height: 270px;
  border: 2px solid;
  border-radius: 5px;
  text-decoration: none;
  color: #555555;
  margin: 20px 30px;
  &:hover {
    color: #ffffff;
    background-color: #555555;
  }
`;

const AddingPortfolioBtn = styled.p`
  pointer-events: none;
  font-size: 16px; ;
`;

const PortfolioAreaCom = ({
  content,
  index,
  userID,
}: {
  content: websiteComContent;
  index: number;
  userID: string | undefined;
}) => {
  const dispatch = useDispatch();
  const websiteData = useSelector((state: RootState) => state.WebsiteReducer);
  const isPreview = useSelector(
    (state: RootState) => state.IsPreviewReducer.website
  );
  const { portfolioSinglePopup } = useSelector(
    (state: RootState) => state.IsPreviewReducer
  );

  const handleDelete = (portfolioID: string, portfolioListIndex: number) => {
    dispatch(isPreviewTrue("portfolioSinglePopup"));
    window.localStorage.setItem("deletePortfolioID", portfolioID);
    window.localStorage.setItem(
      "deletePortfolioListIndex",
      JSON.stringify(portfolioListIndex)
    );
    window.localStorage.setItem("deleteContentIndex", JSON.stringify(index));
  };

  const sureToDelete = (isSure: boolean) => {
    if (isSure) {
      deleteSinglePortfolio(
        window.localStorage.getItem("deletePortfolioID")!,
        Number(window.localStorage.getItem("deletePortfolioListIndex")),
        Number(window.localStorage.getItem("deleteContentIndex"))
      );
    }
    dispatch(isPreviewFalse("portfolioSinglePopup"));
  };
  const deleteSinglePortfolio = (
    portfolioID: string,
    portfolioListIndex: number,
    index: number
  ) => {
    firebase.deletePortfolio(portfolioID);

    const tempPortArr = [...websiteData.content[index].portfolioID];
    tempPortArr.splice(portfolioListIndex, 1);
    dispatch(websiteChangePortfolioID(index, tempPortArr));
    const tempImgArr = [...websiteData.content[index].image];
    tempImgArr.splice(portfolioListIndex, 1);
    dispatch(websiteAddImage(index, tempImgArr));
    const tempTextArr = [...websiteData.content[index].text];
    tempTextArr.splice(portfolioListIndex, 1);
    dispatch(websiteChangeText(index, tempTextArr));

    const tempWebsiteData = { ...websiteData };
    tempWebsiteData.content[index] = {
      ...tempWebsiteData.content[index],
      portfolioID: tempPortArr,
      image: tempImgArr,
      text: tempTextArr,
    };
    firebase.uploadDoc("websites", userID!, tempWebsiteData);
  };

  return (
    <Wrapper>
      {content.portfolioID?.map((portfolioID, portfolioListIndex) => {
        return (
          <PortfolioShowing key={portfolioID}>
            <PortfolioCard
              key={portfolioID}
              to={`/portfolio/${portfolioID}`}
              onClick={() => {
                window.localStorage.setItem(
                  "portfolioListIndex",
                  JSON.stringify(portfolioListIndex)
                );
                window.localStorage.setItem(
                  "websiteContentIndex",
                  JSON.stringify(index)
                );
                dispatch(setPortfolioListIndex(portfolioListIndex));
                dispatch(setPortfolioIndex(index));
              }}
            >
              <PortfolioImg img={content.image[portfolioListIndex]} />
              <PortfolioTitle>
                {content.text[portfolioListIndex]}
              </PortfolioTitle>
            </PortfolioCard>
            {isPreview ? null : (
              <DeleteBtn
                onClick={() => {
                  handleDelete(portfolioID, portfolioListIndex);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </DeleteBtn>
            )}
            <PopUp
              isPopup={portfolioSinglePopup}
              text={"是否確定要刪除此作品集? 一旦刪除將無法回復"}
              sureToDelete={sureToDelete}
            ></PopUp>
          </PortfolioShowing>
        );
      })}
      {isPreview ? null : (
        <AddingPortfolio
          to={"/portfolio/create"}
          onClick={() => {
            window.localStorage.setItem(
              "websiteContentIndex",
              JSON.stringify(index)
            );
            dispatch(setPortfolioIndex(index));
          }}
        >
          <AddingPortfolioBtn>
            <FontAwesomeIcon icon={faBook} />
            {" 新增作品集"}
          </AddingPortfolioBtn>
        </AddingPortfolio>
      )}
    </Wrapper>
  );
};

export default PortfolioAreaCom;
