import { AnyAction } from "redux";
import { v4 } from "uuid";
import { ActionType } from ".";

export interface portfolioReducer {
  title: string;
  mainImage: string;
  content: {
    image: string[];
    text: string[];
    type: number;
    comName: string;
    id: string;
  }[];
  name: string;
  followers: {
    name: string;
    userID: string;
    userImage: string;
  }[];
  tags: string[];
  time: null | number;
  userID: string;
  portfolioID: string;
}

const PortfolioReducer = (
  portfolioData: portfolioReducer = {
    title: "Title",
    mainImage: "",
    content: [],
    name: "",
    followers: [],
    tags: [],
    time: null,
    userID: "",
    portfolioID: "",
  },
  action: AnyAction
) => {
  switch (action.type) {
    case ActionType.PORTFOLIO.INITIAL_SETUP: {
      let tempData = { ...portfolioData };
      if (action.payload.type === "title") {
        tempData = { ...tempData, title: action.payload.text };
      } else if (action.payload.type === "mainImage") {
        tempData = { ...tempData, mainImage: action.payload.text };
      } else if (action.payload.type === "portfolioID") {
        tempData = { ...tempData, portfolioID: action.payload.text };
      }
      return tempData;
    }
    case ActionType.PORTFOLIO.ADD_COMPONENT: {
      const tempContentArr = [...portfolioData.content];
      const tempContent = { ...action.payload.content };
      tempContent.id = v4();
      tempContentArr.push(tempContent);
      const newPortfolioData = { ...portfolioData, content: tempContentArr };
      return newPortfolioData;
    }
    case ActionType.PORTFOLIO.DELETE_COMPONENT: {
      const tempContentArr = [...portfolioData.content];
      const index = action.payload.index;
      tempContentArr.splice(index, 1);
      const newPortfolioData = { ...portfolioData, content: tempContentArr };
      return newPortfolioData;
    }
    case ActionType.PORTFOLIO.FILL_CONTENT: {
      const index = action.payload.index;
      const tempContentArr = [...portfolioData.content];

      tempContentArr[index] = {
        ...portfolioData.content[index],
        [action.payload.type]: action.payload.arr,
      };
      const newPortfolioData = { ...portfolioData, content: tempContentArr };
      return newPortfolioData;
    }
    case ActionType.PORTFOLIO.ADD_IMAGE: {
      const tempContentArr = [...portfolioData.content];
      const index = action.payload.index;
      tempContentArr[index] = {
        ...portfolioData.content[index],
        image: action.payload.imageArr,
      };
      const newPortfolioData = { ...portfolioData, content: tempContentArr };
      return newPortfolioData;
    }
    case ActionType.PORTFOLIO.ADD_TIME: {
      const tempObj = { ...portfolioData, time: Date.now() };
      return tempObj;
    }
    case ActionType.PORTFOLIO.ADD_SETTING: {
      let tempPortfolioeData = portfolioData;
      tempPortfolioeData = {
        ...portfolioData,
        [action.payload.type]: action.payload.text,
      };
      return tempPortfolioeData;
    }
    case ActionType.PORTFOLIO.RENEW_CONTENT: {
      const tempPortfolioeData = {
        ...portfolioData,
        content: action.payload.content,
      };
      return tempPortfolioeData;
    }
    case ActionType.PORTFOLIO.LOADING: {
      const tempPortfolioeData = action.payload.data;
      return tempPortfolioeData;
    }
    default:
      return portfolioData;
  }
};

export default PortfolioReducer;
