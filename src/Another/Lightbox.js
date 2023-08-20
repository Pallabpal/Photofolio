import './ligtbox.css'
import { db } from '../firebase/config';
import { doc, updateDoc} from "firebase/firestore";

 import { useState, useEffect } from 'react';
import {motion} from 'framer-motion';
// import { useEffect } from 'react';
export default function Lightbox({setLightbox, imageInd, imagearray, albums, albumid}){
// const [logo, setLogo]=useState(' ')
// console.log(imagearray)
const [arr, setArr]=useState(null);
   const toggele=()=>{
       setLightbox(false);
   }
   useEffect(()=>{
    let images= albums.flatMap((album, index)=>(album.id===albumid?album.content:null));
    setArr(images);
   }, [])
   
   const deleteImage=async()=>{
    // let arr = albums.flatMap((album, index) => {
    //     if (album.id === albumid) 
    //     {
    //     //  console.log("delete", album.content,imageInd );
        
    //     return album.content
    //     }
    //     return null;
        
    //   });
    // let arr= albums.flatMap((album, index)=>(album.id===albumid?album.content:null))

    //   console.log(arr.splice(imageInd, 1));
      // const index=albums.findIndex((element)=>element.id===albumid)
     imagearray.splice(imageInd,1);
      console.log(imagearray);
      const docRef = doc(db, "albums", albumid);     
      await updateDoc(docRef, {
        content: imagearray
      });
      setLightbox(false);
      
   }
  
    const handlechangeAlbum=async()=>{
    const docRef = doc(db, "albums", albumid);    
    await updateDoc(docRef, {
        titleimg:imagearray[imageInd] 
      });
      
   }
   const downloadfile=()=>{
         let hidden_a = document.createElement('a');
         hidden_a.setAttribute('href', 'data:text/plain;charset=utf-8, '+ encodeURIComponent(imagearray[imageInd]));
         
         // also set the value of the download attribute
         hidden_a.setAttribute('download', "img_file");
         document.body.appendChild(hidden_a);
         
         // click the link element
         hidden_a.click();  
         document.body.removeChild(hidden_a);
   }
    return(
            <>
            <motion.div  className='wrapper'
            
            initial={{y:"-100vh"}}
            animate={{y:0}}
            >
              <img onClick={toggele} src={imagearray[imageInd]} alt={' '} />
              <div className='lightbox-btn'>
              <button onClick={deleteImage}>Delete</button>
              <button onClick={handlechangeAlbum}>Change Album photo</button>
              <button onClick={downloadfile}>Download</button>
              </div>
            </motion.div>
            
            </>
    )
}