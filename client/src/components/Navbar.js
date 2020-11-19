import React, { useContext,useEffect,useRef,useState } from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
const Navbar = ()=>{
  const {state,dispatch}=useContext(UserContext)
  const searchModal = useRef(null)
  const [search,newSearch] = useState("")
  const [userDetails,setUserDetails] = useState([])
const history = useHistory()

useEffect(()=>{
M.Modal.init(searchModal.current)
},[])



const fetchUser=(query)=>{
  newSearch(query)
fetch('/search-user',{
  method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query:query
          })
          }).then(res=>res.json())
          .then(result=>{
            // console.log(result)
            setUserDetails(result)
          })
            
}


  const renderList=()=>{

    if(state){
      return[
        <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
        <li  key="2"><Link to="/profile">Profile</Link></li>,
        <li  key="3"><Link to="/createpost">Create Post</Link></li>,
        <li  key="4"><Link to="/exploreposts"> My Following Posts</Link></li>,
        <li  key="5">
        <button className="btn #d32f2f red darken-2" onClick={()=>{
          localStorage.clear()
          dispatch({type:"CLEAR"})
          history.push('/login')
        }}>Logout
        </button>
        </li>
      ]
    }
      else{
        return[
          <li  key="6"><Link to="/login">Login</Link></li>,
              <li  key="7"><Link to="/signup">Signup</Link></li>
        ]
      }
    }
  
    return(
        <nav>
        <div className="nav-wrapper white">
          <Link to={state?'/':'/login'}className="brand-logo left">Instapost</Link>
          <ul id="nav-mobile" className="right">
           {renderList()}
          </ul>
        </div>
        <div id="modal1" className="modal" style={{color:"black"}} ref={searchModal}>
        <div className="modal-content input-field" style={{color:"black"}}>
        <input 
          type="text"
          placeholder="search users"
          onChange={(e)=>{fetchUser(e.target.value)}}
          />
       <ul className="collection" >
               {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} key={item._id} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   newSearch('')
                 }}><li className="collection-item" key={item._id}>{item.email}</li></Link> 
               })}
               
              </ul>
          </div>
    
    <div className="modal-footer">
      <button className="modal-close waves-effect waves-green btn-flat" >Agree</button>
    </div>
  </div>
      </nav>
    )
   
}
export default Navbar