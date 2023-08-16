import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
const Progressbar=({blogs, removeBlog, updateBlog, getValue})=>{
      const handleChange=(e)=>{
      let select= document.getElementById("select");
      let value=select.options[select.selectedIndex].value;
      console.log(value);
      getValue(value);
      showUpdateMessage();
    }
    const  showUpdateMessage=()=>{
         toast.info(' Click Update Type', {
            position: toast.POSITION.TOP_CENTER
     });
    }
    const  showCopyMessage=()=>{
      toast.success('Image Path Copied', {
         position: toast.POSITION.TOP_CENTER
  });
 }
    return(
        <>
               <div className='select'>
                     <select id="select"  onChange={handleChange}>
                        <option selected disabled>Choose Image Type</option>
                        <option className="optins" value="1">Animal</option>
                        <option className="optins" value="2">Nature</option>
                        <option className="optins" value="3">Human</option>
                     </select>
               </div>
            <div className="imageContainer">
                  {
                     blogs.map((value, index)=>(
                        <div key={index} className='gallery'  >
                        <img src={value.imageUrl} alt={""}/>
                        <div className='btn'>
                                    <button onClick={() => {removeBlog(value.id)}}>Delete</button>
                                    <button onClick={()=>updateBlog(value.id)}>Update Type</button>
                                    <button onClick={ showCopyMessage}>Copy Path</button>
                                    <a className="download" href={value.imageUrl} download >
                                       <img src='https://cdn-icons-png.flaticon.com/128/1092/1092004.png' alt={' '}/>
                                    </a>
                           </div>
                        </div>
                        ))
                     }
               </div>
               <ToastContainer />
           </>
    )
}
export default Progressbar;