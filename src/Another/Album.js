import { useEffect, useState } from "react"
import {db} from "../firebase/config";
import Loader from "../Loader/loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './body.css'
// import {uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onSnapshot, doc, setDoc, collection, updateDoc } from "firebase/firestore";
import AlbumPage from "./Albumpage";
export default function Album(){
  const [albums, setAlbums]=useState([]);
  const [albumid, setAlbumId]=useState(null);
  const[loading, setLoading]=useState(true);
  const [createbutton, setCreatebutton]=useState(false);
  const[name, setName]=useState(' ')
  // const [logo, setLogo]=useState("https://cdn-icons-png.flaticon.com/128/8379/8379818.png")
  // console.log(createbutton);
//   console.log(albums);
// console.log(logo);
  useEffect(()=>{
    onSnapshot(collection(db, "albums"), (snapShot) => {
      const albums= snapShot.docs.map((doc)=>{
      return{
          id:doc.id,
          ...doc.data()
      }
    })
  albums.sort((a, b) => b.createTime.localeCompare(a.createTime));
  console.log(albums);
  setAlbums(albums);
  setLoading(false);
  });
},[])

const updateBlog= async(id,text)=>{
    // console.log("items", text, id);
    let arr = albums.flatMap((album, index) => {
        if (album.id === id) 
        {
          // console.log(album);
         return album.content;
        }
        else return [];
      });
    //   console.log(arr);
      arr.unshift(text);
      const docRef = doc(db, "albums", id);     
      await updateDoc(docRef, {
        content: arr
      });
      
      
   }
const changeHandler=async (e)=>{
    e.preventDefault();
    let selected=document.getElementById("input").value
    if(selected){
        document.getElementById("input").value=''
        const docRef=doc(collection(db, "albums"));
        await setDoc(docRef, {
        title:selected,
        titleimg:null,
        content:[],
        createdOn: new Date().toLocaleDateString(),
        createTime: Date.now().toString()
      })
      if(selected)
      toast.success(`${selected} Created Successfully!`, {
        position: toast.POSITION.TOP_RIGHT
    });
     
   

    }
    else{
        alert("Enter Input")
        return ;
    }
}
const  resetid=()=>{
    setAlbumId(null);
}

const handleClick=(id)=>{
//    console.log(id)
  const txt= albums.flatMap((album, index) => {
  if (album.id === id) 
  {
   return album.title;
  }
  else return '';
});
     setName(txt);
     setAlbumId(id);

}

const albumCreate=()=>{
  setCreatebutton(true);
}
const handleClose=()=>{
  setCreatebutton(false);
}
    return(
        <>
        {loading?<Loader />:
        <div className="album-Container">
        
        {albumid?null:
        <> 
        <div className="heading">
          <h1>Your albums</h1>
          <button onClick={albumCreate} className="btn1 btn3">Add album</button>
        </div>
        {createbutton? <form onSubmit={changeHandler}>
          
          <div className="Input-button">
         <input id="input" type="text" placeholder="Enter Album Name"/>
        </div>
        <ToastContainer />
        <button type="submit" className="btn1">Clear</button>
        <button type="submit" className="btn1 btn2">Create</button>
        <button type="submit" className="btn1 btn4" onClick={handleClose}>Cancel</button>
        </form> : null}
        <div className="gallery">
            {albums.map((album, index)=>(
                <div className="card" onClick={()=>handleClick(album.id)} key={index}>
                  
                 <div className="details">{album.title}</div> 
                 <img src={album.titleimg?album.titleimg:"https://cdn-icons-png.flaticon.com/128/8379/8379818.png"}
                 style={{width:album.titleimg?"100%":"70px", 
                 height:album.titleimg?"100%":"70px" 
                }}
                 alt={' '}/>
                  </div>
            ))}
           
        </div>
        </>}
        {albumid && <AlbumPage albumid={albumid} albums={albums} resetid={resetid} updateBlog={updateBlog}
        loading={loading} setLoading ={setLoading} name={name} setName={setName} />}
        </div>
      }
        </>
    )
}