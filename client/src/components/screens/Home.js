import react,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
const Home=()=>{
    const { state, dispatch } = useContext(UserContext)
    const [data,setData] = useState([])
useEffect(()=>{
    fetch('/allposts',{
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        //
        setData(result.posts)
    })
    .catch(err=>{
        console.log(err)
    })
},[])

const likePost=(id)=>{
    fetch('/like',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId:id
        })
    }).then(res=>res.json())
    .then(result=>{
        const newData = data.map(item=>{
            if(result._id==item._id){
                return result
            }
            return item
        })
        setData(newData)
    })
}

const unlikePost=(id)=>{
    fetch('/unlike',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId:id
        })
    }).then(res=>res.json())
    .then(result=>{
        
        const newData = data.map(item=>{
            if(result._id==item._id){
                return result
            }
            return item
        })
        setData(newData)
    })
}
const makeComment=(text,id)=>{
    fetch('/comment',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            text:text,
            postId:id,
        })
    }).then(res=>res.json())
    .then(result=>{
        const newData = data.map(item=>{
            if(result._id==item._id){
                return result
            }
            return item
        })
        setData(newData)
    
    })
}
const deletePost=(postId)=>{
fetch(`/deletepost/${postId}`,{
    method:"delete",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt") 
        }
})
.then(res=>res.json())
.then(result=>{

     const newData= data.filter(item=>{
         return( item._id != result._id)
        
      })
      setData(newData)
     
    
})

}
const deleteComment = (postid, commentid) => {
   
    fetch(`/deletecomment/${postid}/${commentid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
             const newData = data.map((item) => {

          if (item._id == result._id) {
                     return result;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };
    return(
        <div className="myhome" >
            {
                data.map((item)=>{
                    
                    return(
                        <div className="card auth-home input-field" key={item._id}>
                         <div style={{}}> 
                         <div>
                        <img  style={{height:"45px",width:"45px",borderRadius:"22.5px",position:"absolute",left:"10px",marginTop:"2px"}} src={item.postedBy.pic} /> 
                        </div>
                       
                        <h5 style={{padding:"8px",position:"relative",left:"60px",top:"5px"}}><Link to = {item.postedBy._id != state._id ?'/profile/'+item.postedBy._id:'/profile' }>{item.postedBy.name}</Link> 
                         </h5>
                         {item.postedBy._id == state._id &&
                        <i className="material-icons" style={{position:"absolute",right:"50px",top:"10px"}}><Link to = {'/editpost/'+item._id }>edit</Link></i> }
                         {item.postedBy._id == state._id &&
                        <i className="material-icons" style={{position:"absolute",right:"10px",top:"10px"}} onClick={()=>{deletePost(item._id)}} >delete</i> }
                          </div>
                   
                       
                       
                        <div className="card-image">
                            <img src={item.photo} />
                        </div>
                        <div className="card-content">
                        <i className="material-icons" style={{
                            color:'red',width:30}}>favorite</i>
                            {
                                item.likes.includes(state._id)
                                ?
                                        <i className="material-icons" style={{ width: 30 }} onClick={() => { unlikePost(item._id) }} >thumb_down</i>
                                        :
                                        <i className="material-icons" style={{width:30}} onClick={()=>{likePost(item._id)}} >thumb_up</i>
                            }
                            
                            
                            <h6>{state?item.likes.length:0} Likes</h6>
                            <h6>{state?item.title:0}</h6>
                            <p>{state?item.body:0}</p>
                            {
                                item.comments.map(record=>{
                                    return(
                                        <h6 key={record._id}><span style={{fontWeight:500}}>{record.postedBy.name}</span> {record.text}  {record.postedBy._id === state._id &&
                                            <i className="material-icons" style={{float:"right"}} onClick={()=>{deleteComment(item._id,record._id)}} >delete</i> }</h6>
                                    )
                                    
                                })
                            }
                            <form onSubmit={(e)=>{
                                e.preventDefault()
                                makeComment(e.target[0].value,item._id)
                            }
                            }>
                           
                            <input 
                            type='text' placeholder="Add a comment" />
                             </form>
                        </div>
                    </div>
                    )

                })
            }
           
        </div>
      
    )
}

export default Home