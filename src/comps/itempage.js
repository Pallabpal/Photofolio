import { useState } from "react"
import '../App.css';

 const Itempage=({blogs, updateBlog,removeBlog})=>{
    const [page, setPage]=useState('')
    // console.log(blogs);
    const seeItems=(val)=>{
       setPage(val);
      }
   return(
    <>
      <div className="tab">
          <button onClick={()=>seeItems("1")}>Animal</button>
          <button onClick={()=>seeItems("2")}>Nature</button>
          <button onClick={()=>seeItems("3")}>Human</button>
      </div>
      <div className="imageContainer">
          {
          blogs.map((value, index) => (
            page === value.type ? (
              <div key={index} className='gallery'>
                <img src={value.imageUrl} alt="" />
                <div className='btn'>
                        <button onClick={() => {removeBlog(value.id)}}>Delete</button>
                        <button onClick={()=>updateBlog(value.id)}>Update Type</button>
                        <a className="download" href={value.imageUrl} download >
                        <img src='https://cdn-icons-png.flaticon.com/128/1092/1092004.png' alt={' '}/>
                        </a>
                  </div>
              </div>
            ) : null
          ))

        }
    </div>
      <hr />
    </>
  )

}
export default Itempage;