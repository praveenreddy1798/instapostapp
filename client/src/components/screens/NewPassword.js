import React,{useState,useContext} from 'react'
import {Link,useHistory, useParams} from 'react-router-dom'
import M from 'materialize-css'



const NewPassword =()=>{
  const [password,newPassword]=useState("")
  const history = useHistory()
  const {token} = useParams()
console.log(token)
  const postData=()=>{
   
    fetch('/newpassword',
    {
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        password,
        token
        
      })
      })
      .then(res=>res.json())
      .then(data=>{
        if(data.error){
          return M.toast({html: data.error,classes:"#c62828 red darken-3"})
         
        }
        else{
          
            M.toast({html:data.message,classes:"#81c784 green lighten-2"})
            history.push('/login')
        }
        
    })
    .catch(err=>{
      console.log(err)
    })
  }

    return(
        <div className="mycard">
          <div className="card auth-card input-field">
          <h2>Instapost</h2>
          <input 
          type="password"
          placeholder="enter your new password"
          onChange={(e)=>{newPassword(e.target.value)}}
          />
          <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>postData()}>Reset Password
          </button>
          
          </div>
        </div>
        
    )
}

export default NewPassword