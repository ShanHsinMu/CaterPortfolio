import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { UserReducer } from "../reducers";
import { signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { userLoading } from "../action/UserReducerAction";
import { resumeLoading } from "../action/ResumeReducerAction";
import { websiteLoading } from "../action/WebsiteReducerAction";
import { portfolioLoading } from "../action/PortfolioReducerAction";
import { setAlert } from "../action/IsPreviewReducerAction";
import { useDispatch } from "react-redux";
import useAlertCalling from "./useAlertCalling";

import { initialResumeData } from "../reducers/ResumeContent";
import { initialWebsiteData } from "../reducers/WebsiteContent";
import { initialPortfolioData } from "../reducers/PortfolioContent";

const Wrapper = styled.div<{ isSideBar: boolean }>`
  position: fixed;
  right: ${(props) => (props.isSideBar ? "0" : "-200px")};
  top: 0px;
  height: 100vh;
  width: 200px;
  background-color: #555555f2;
  transition: right 1.5s;
  /* border-left: 1px solid; */
`;

const TagArea = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
`;

const Tag = styled(Link)<{ $isMobile: Boolean }>`
  display: ${(props) => (props.$isMobile ? "none" : "block")};
  color: #ffffff;
  text-decoration: none;
  margin: 0 20px 20px;
  @media screen and (max-width: 900px) {
    display: block;
  }
`;

const Nav = styled.p`
  position: relative;
  color: #ffffff;
  cursor: pointer;
  font-size: 28px;
  top: 15px;
  left: 20px;
`;

const initialUserData = {
  name: "",
  email: "",
  password: "",
  userID: "",
  userImage: "",
  backgroundImage: "",
  introduction: "",
  chatRoom: [],
  followers: [],
  interestingTags: [],
  tags: [],
  followMembers: [],
  followResumes: [],
  followPortfolios: [],
  followWebsites: [],
};

const HeaderSidebar = ({
  userData,
  auth,
  isSideBar,
  setIsSideBar,
}: UserReducer) => {
  const nevigate = useNavigate();
  const dispatch = useDispatch();

  const { startAlert } = useAlertCalling();
  const signoutHandler = () => {
    signOut(auth);
    nevigate("/");
    dispatch(userLoading(initialUserData));
    dispatch(portfolioLoading(initialPortfolioData));
    dispatch(websiteLoading(initialWebsiteData));
    dispatch(resumeLoading(initialResumeData));
    startAlert("成功登出!");
  };

  return (
    <Wrapper isSideBar={isSideBar}>
      <Nav
        onClick={(e) => {
          setIsSideBar(false);
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </Nav>
      <TagArea>
        <Tag to={`/allportfolios`} $isMobile={true}>
          所有作品集
        </Tag>
        <Tag to={`/allresumes`} $isMobile={true}>
          所有履歷
        </Tag>
        <Tag to={`/chatroom/${userData.userID}`} $isMobile={true}>
          聊天室
        </Tag>
        <Tag to={`/profile/${userData.userID}`} $isMobile={false}>
          個人頁面
        </Tag>
        <Tag to={`/resume/${userData.userID}`} $isMobile={false}>
          個人履歷
        </Tag>
        <Tag to={`/website/${userData.userID}`} $isMobile={false}>
          個人網站
        </Tag>
        <Tag to={"/"} onClick={signoutHandler} $isMobile={false}>
          登出
        </Tag>
      </TagArea>
    </Wrapper>
  );
};

export default HeaderSidebar;
