import {  useEffect,useState } from "react";
import {db,storage} from "../firebase/config"
import { doc, deleteDoc, updateDoc} from "firebase/firestore";
import './body.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../Loader/loader";
import { ref,uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Lightbox from "./Lightbox";
export default function AlbumPage({albumid, resetid, albums,updateBlog,name, setName, loading, setLoading}){
  const [file, setFile]=useState('');
  const[progressbar, setProgressbar]=useState('')
  const [lightbox, setLightbox]=useState(false)
  const [imagearry, setImagearray]=useState([]);
  const [imageInd, setImageInd]=useState(null);
  const [rename, setRename]=useState('')
  const [renamebtn, setRenamebtn]=useState(false);
  // const updateArray=['deleteAlbum']
  const types=['image/jpeg', 'image/png', 'image/jpg'];
  // console.log({name});
  // console.log(lightbox);
   const returnbutton=()=>{
     resetid();
   }

   const changeHandler=(e)=>{
    e.preventDefault();
    let selected=e.target.files[0];
    if(selected && types.includes(selected.type))
    setFile(selected);
    else{
        alert("Choose valid file")
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
        if(progress>0 && progress<100)
        // console.log('Upload is ' + progress + '% done');
        setProgressbar(progress);
      }, 
    (error) => {
    alert("Error to Fetching Images:)", error);
    return;
  }, 
  () => {
       getDownloadURL(uploadTask.snapshot.ref).then( async(downloadURL) => {
       
      updateBlog(albumid, downloadURL);
      setFile(null);
      setProgressbar(null);
    });
  });
 }
 else
 return; 
},[file])

const handleLightbox=(imagearry, index)=>{
  // console.log(imagearry, index);
  setImagearray(imagearry);
  setImageInd(index);
  setLightbox(true);
}
async function deleteAlbum(){
  resetid();
  const docRef= doc(db,"albums",albumid)
  await deleteDoc(docRef);
 
 }
 const updatebutton=async (value)=>{
   if(value===0){
    const docRef = doc(db, "albums",albumid);     
    await updateDoc(docRef, {
      title:rename
    });
   }
   setName(rename);
   setRename('');
   setRenamebtn(false);
   toast.info('Album Renamed!', {
    position: toast.POSITION.TOP_CENTER
});
 }
    return(
        <>
        {lightbox?<Lightbox setLightbox={setLightbox} imageInd={imageInd} imagearray={imagearry} albums={albums}
        albumid={albumid} 
       />:<div>
        <div className="Albumpage">
       {/* <h2> Album :{name&&name}</h2> */}
       <h2>{rename?rename:name}</h2>
      
       <button className="btn1" onClick={deleteAlbum}>Delete</button>
       {renamebtn?<><p><input value={rename} onChange={(e)=>setRename(e.target.value)} ></input></p>
       <p> <p><button className="btn1" onClick={()=>updatebutton(0)}>Update</button></p></p></>:
       <button className="btn1 btn2" onClick={()=>setRenamebtn(!renamebtn)}>Rename</button>
       }
       <ToastContainer />
       
       </div>
        <div>
         <button className="return-btn" onClick={returnbutton}>
          <img src="https://cdn-icons-png.flaticon.com/128/709/709624.png" alt={' '}/>
         </button>
         </div>
            <form id="form">
                <div id="label">
                    <label for="upload" className="label">
                        <img src="https://cdn-icons-png.flaticon.com/128/2716/2716054.png" alt="{ }"/>
                        <span>Upload Photo</span>
                      </label>
                    <input id="upload" type="file" onChange={changeHandler}/>
                    {/* <div style={{color:"red"}}>{file && file.name}</div> */}
                </div>
               
              </form>
         <div className="imageContainer">
         
         {albums.map((album) => {
            if (albumid === album.id) {
            
            return album.content.map((value, index) => (
             <div  key={index} className="Image-item" onClick={()=>handleLightbox(album.content, index)}>
              
              <img src={value} alt={' '} />
              </div>
             ));
           }
       return null;
})}

         </div>
        </div>}
        </>
    )
}