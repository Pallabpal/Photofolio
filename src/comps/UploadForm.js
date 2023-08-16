import React, { useEffect, useState } from "react";
import {db, storage} from "../firebase/config"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Progressbar from "./Progressbar";
import Itempage from "./itempage";
import'../App.css';
import { ref,uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onSnapshot, doc, setDoc, collection, deleteDoc, updateDoc } from "firebase/firestore";

const UploadForm =()=>{
   const [file, setFile]=useState();
   const [blogs, setBlogs] =  useState([]);
   const [items, setItems] =  useState('');
   const[progressbar, setProgressbar]=useState('')
   const types=['image/jpeg', 'image/png', 'image/jpg'];
  useEffect(()=>{
        onSnapshot(collection(db, "blogs"), (snapShot) => {
          const blogs= snapShot.docs.map((doc)=>{
          return{
              id:doc.id,
              ...doc.data()
          }
        })
      setBlogs(blogs);
      
      });
   },[])
  const changeHandler=(e)=>{
        e.preventDefault();
        let selected=e.target.files[0];
        if(types.includes(selected.type) && selected )
        setFile(selected);
        else{
            alert("file not valid")
            return ;
        }
  }

  useEffect(()=>{
        if(file){
            const name= file.name;
            const storageRef = ref(storage,  name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed', 
               (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              setProgressbar(progress);
            }, 
          (error) => {
          alert("Error to Fetching Images:)", error);
          return;
        }, 
        () => {
             getDownloadURL(uploadTask.snapshot.ref).then( async(downloadURL) => {
             const docRef=doc(collection(db, "blogs"));
             await setDoc(docRef, {
             title:name,
             imageUrl:downloadURL,
             createdOn: new Date().toLocaleDateString()
           })
           setFile(null);
           setProgressbar(null);
           showUploadMessage();
          });
        });
       }
       
    },[file])
    const showUploadMessage=()=>{
        toast.success(' Image Added Successfully', {
        position: toast.POSITION.TOP_LEFT
    });
    }
    const showUpdateTypeMessage= (value) => {
      if(!value){
      toast.error("Not selected any type",{
        position: toast.POSITION.TOP_RIGHT
      })

      }
      else
      toast.success('Added to: '+value, {
          position: toast.POSITION.TOP_RIGHT,
      });
   };
    
    const showToastMessage = () => {
      toast.success('Deletion Successful', {
          position: toast.POSITION.TOP_RIGHT
      });
   };
    async function removeBlog(id){
      showToastMessage();
      const docRef= doc(db,"blogs",id)
      await deleteDoc(docRef);
     }

    const updateBlog= async(id)=>{
      console.log("items", items);
      const docRef =doc(db,"blogs", id )
      await updateDoc(docRef,{
        type:items?items:''
      })
      let value=''
      if(items==='1') value='Animal';
      else
      if(items==='2') value='Nature';
      else
      if(items==='3') value='Human';
      showUpdateTypeMessage(value);
        
     }
    const getValue=(value)=>{
      console.log(value);
       setItems(value);
     }
    return(
    <>
        <Itempage blogs={blogs} updateBlog={updateBlog} removeBlog={removeBlog}/>
          <div className="progress" style={{ width: progressbar ? progressbar + '%' : 0 ,
          display:progressbar?"block":"none"}}></div>
            <form id="form">
              <div id="label">
                  <label for="input" className="label">
                      <img src="https://cdn-icons-png.flaticon.com/128/2716/2716054.png" alt="{ }"/>
                      <span>Upload Photo</span>
                    </label>
                  <input id="input" type="file" onChange={changeHandler}/>
              </div>
              <div style={{color:"white"}}>{file && file.name}</div>
            </form>
          {blogs.length>0 && <Progressbar blogs={blogs} removeBlog={removeBlog} updateBlog={updateBlog}
          getValue={getValue} /> }
          <ToastContainer />
      </>
    )
}
export default UploadForm;