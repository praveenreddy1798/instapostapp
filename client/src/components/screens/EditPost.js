import React,{useState,useEffect} from 'react'
import {Link,useHistory, useParams} from 'react-router-dom'
import M from "materialize-css"
const CreatePost = () => {
    const [body,setBody]=useState("")
    const [title,setTitle]=useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")
    const history=useHistory()
    const {postId} = useParams()
    useEffect(()=>{
        if(url){
            fetch(`/editpost/${postId}`,
            {
              method:"post",
              headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                title,
                body,
                photo:url
              })
              }) 
              .then(res=>res.json())
              .then(data=>{
                  console.log(data)
                if(data.error){
                 M.toast({html:data.error,classes:"#c62828 red darken-3"}) 
                  }
                  else{
                       M.toast({html:"successfully updated",classes:"#81c784 green lighten-2"})
                       history.push('/')
                       
                    } 
              })
              .catch(err=>{
                console.log(err)   
            })

        }

    },[url])

       
    const postDetails=()=>{
        if(!image){
          return  M.toast({html:"Fill in the fields",classes:"#c62828 red darken-3"})  
            }
            else{
                const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","instagram-clone")
        data.append("cloud_name","praveen-kumar")
        fetch("https://api.cloudinary.com/v1_1/praveen-kumar/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
           setUrl(data.url)
        })

        .catch(err=>{
            console.log(err)   
        })

    
      
    }
    
           
            }
        

    return (
        <div className="card create-card input-field">
            <h2>Update Post</h2>
            <input
             type="text"
            placeholder="title" 
            onChange={(e)=>{setTitle(e.target.value)}}
            />
            <input type="text"
            placeholder="body" 
            onChange={(e)=>{setBody(e.target.value)}}
            />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Upload Image</span>
                    <input type="file" 
                    onChange={(e)=>{setImage(e.target.files[0])}}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>postDetails()}>Submit Post
          </button>
        </div>
    )
}
export default CreatePost
