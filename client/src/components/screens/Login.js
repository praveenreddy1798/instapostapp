import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'


const Login =()=>{
 const {state,dispatch} = useContext(UserContext)
  const [email,newEmail]=useState("")
  const [password,newPassword]=useState("")
  const history = useHistory()


  const postData=()=>{
   
    fetch("/login",
    {
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
      })
      .then(res=>res.json())
      .then(data=>{
        console.log(data)
        if(data.error){
          return M.toast({html: data.error,classes:"#c62828 red darken-3"})
         
        }
        else if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)){
          return  M.toast({html: "invalid email or password",classes:"#c62828 red darken-3"})
          
           }
        else{
          localStorage.setItem("jwt",data.token)
          localStorage.setItem("user",JSON.stringify(data.loggeduser))
          dispatch({type:"USER",payload:data.loggeduser})
            M.toast({html:"successfully signed in",classes:"#81c784 green lighten-2"})
            history.push('/')
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
          type="text"
          placeholder="email"
          onChange={(e)=>{newEmail(e.target.value)}}
          />
           <input 
          type="password"
          placeholder="password"
          onChange={(e)=>{newPassword(e.target.value)}}
          />
          <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>postData()}>Login
          </button>
          <h5>
          <Link to ="/signup">
          Don't have an account ?
          </Link>
          </h5>
          <h6>
          <Link to ="/reset">
          Forgot password ?
          </Link>
          </h6>
          
          </div>
        </div>
        
    )
}

export default Login 