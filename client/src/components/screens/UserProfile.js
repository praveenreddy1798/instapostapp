import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import {useParams} from 'react-router-dom'
const UserProfile = () => {
    const [userProfile, setuserProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const {userId} = useParams()
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userId):true)
    // console.log(userId)
    useEffect(() => {
        fetch(`/user/${userId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                
               setuserProfile(result)
               console.log(result)
            })
    }, [])

    const followUser=()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userId
            })
        })
        
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            dispatch({type:"UPDATE",payload:{followers:result.followers,following:result.following}})
            localStorage.setItem("user",JSON.stringify(result))
            setuserProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,result._id]
                    }  
                }
               
            })
            setShowFollow(false)
        })
    }

    const unfollowUser=()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userId
            })
        })
        
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            dispatch({type:"UPDATE",payload:{followers:result.followers,following:result.following}})
            localStorage.setItem("user",JSON.stringify(result))
            setuserProfile((prevState)=>{
                const newfollowers=prevState.user.followers.filter(item=>{
                    return(
                        item!=result._id)})
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newfollowers
                    }  
                }
               
            })
            setShowFollow(true)
        })
    }
    return (
       <>
       {userProfile?
    
    <div style={{ maxWidth: '550px', margin: "0px auto" }}>
          
           
    <div style={
        {
            display: 'flex',
            justifyContent: 'space-around',
            margin: "10px 0px",
            borderBottom: " 1px solid grey"
        }}>
        <div>
            <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
               src={userProfile.user.pic}
            />
        </div>
        <div>
             
           
            <h4>{userProfile.user.name}</h4>
            <h5>{userProfile.user.email}</h5>
            <div style={{ display: "flex", justifyContent: 'space-between', width: '109%' }}>
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.following.length} following</h6>             
            </div>
            {showfollow?
                   <button style={{
                       margin:"10px"
                   }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>followUser()}
                    >
                        Follow
                    </button>
                    : 
                    <button
                    style={{
                        margin:"10px"
                    }}
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>unfollowUser()}
                    >
                        UnFollow
                    </button>
                    }
                   
                  
        </div>
    </div>


    <div className="gallery">
        {
            userProfile.posts.map((item) => {
                return (
                    <img key={item._id} className='item' src={item.photo} alt={item.title} />
                )
            })
        }

    </div>
</div>
       
       
       
       
       
       
       
       
       
       :<h3>loading....</h3>}
        
        </>
    )
}


export default UserProfile