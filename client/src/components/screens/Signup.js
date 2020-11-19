import React,{useEffect, useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import  M from 'materialize-css'

const Signup=()=>{
  const [name,newName]=useState("")
  const [email,newEmail]=useState("")
  const [password,newPassword]=useState("")
  const[image,setImage] = useState("")
  const[url,setUrl] = useState(undefined)

  const history=useHistory()

  useEffect(()=>{
    if(url){
      uploadFields()
    }

  },[url])

  const uploadPic=()=>{

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


  
 const uploadFields=()=>{
 
      
      fetch("/signup",
        {
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            name,
            email,
            password,
            pic:url
          })
          }) .then(res=>res.json())
          .then(data=>{
            if(data.error){
            return M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
            if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html: "invalid email",classes:"#c62828 red darken-3"}) 
            }
            else{
              if(data.exist){
                return M.toast({html:data.exist,classes:"#c62828 red darken-3"})
              }
              else{
                M.toast({html:data.message,classes:"#43a047 green darken-1"})
                history.push('/login')
              }
            }
               
           }
         
          }
 
            
              
          )                       
  
    }

    const postData=()=>{
      if(image){
       uploadPic() 
      }
      else{
        uploadFields()
      }
   
      
    }


     
    return(
        <div className="mycard">
          <div className="card auth-card input-field">
          <h2>Instapost</h2>
          <input 
          type="text"
          placeholder="name"
          onChange={(e)=>newName(e.target.value)}
          />
          <input 
          type="text"
          placeholder="email"
          onChange={(e)=>newEmail(e.target.value)}
          />
           <input 
          type="password"
          placeholder="password"
          onChange={(e)=>newPassword(e.target.value)}
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
          <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>postData()}
          > 
          Signup
          </button>
          <h5>
          <Link to ="/login">
          Already have an account?
          </Link>
          </h5>
          
          </div>
        </div>
        
    )
}

  
  

export default Signup