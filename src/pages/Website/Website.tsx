import React,{useRef} from 'react'
import Canves from './Canves'
import EditText from '../../utilis/EditText'
import firebase from '../../utilis/firebase'
import { RootState } from '../../reducers'
import { useSelector } from 'react-redux'

const Website = () => {
  const canvas: any = useRef();
  const storageJson = useRef("");
  const websiteData = useSelector((state: RootState) =>state.WebsiteReducer)
  const uploadWebsite = () => {
    firebase.uploadDoc("websites",websiteData);
  }

  return (
    <>
    <div style={{display:"flex"}}>
    <Canves canvas={canvas} storageJson={storageJson} />
    <EditText type={"website"}/>
  </div><button onClick={uploadWebsite}>上架網站!</button>
  </>
    
  )
}

export default Website