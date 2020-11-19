import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
const Profile = () => {
    const [myPics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const[image,setImage] = useState("")
    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setPics(result.mypost)
            })
    }, [])

    
   
     
    useEffect(()=>{
        if(image){
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","instagram-clone")
            data.append("cloud_name","praveen-kumar")
            fetch("https://api.cloudinary.com/v1_1/praveen-kumar/image/upload",{
                method:"post",
                body:data
            }).then(res=>res.json())
            .then(data=>{
             console.log(data.url)
            
        
            fetch("/updatepic",
            {
              method:"put",
              headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
               pic:data.url
              })
              }) 
              .then(res=>res.json())
              .then(result=>{
                  console.log(result)  
            localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
            dispatch({type:"UPDATEPIC",payload:result.pic})
              })
            })
              .catch(err=>{
                console.log(err)   
            })
        
        }

    },[image])


    return (
        <div style={{ maxWidth: '550px', margin: "0px auto" }}>
                    
        <div style={{margin: "10px 0px",borderBottom: " 1px solid grey"}}>
            <div style={
                {
                    display: 'flex',
                    justifyContent: 'space-around'
                    
                   
                }}>
                <div>
                    <img style={{ width: "160px", height: "160px",marginBottom:"10px", borderRadius: "80px" }}
                        src={state?state.pic:"loading"}
                    />
                </div>
              
                <div>
                    <h4>{state?state.name:"loading"}</h4>
                    <h5>{state?state.email:"loading"}</h5>
                    <div style={{ display: "flex", justifyContent: 'space-between', width: '109%' }}>
                        <h6>{myPics.length} posts</h6>
            <h6>{state?state.followers.length:"0"} followers</h6>
                        <h6>{state?state.following.length:"0"} following</h6>
                    </div>
                </div>
            </div>
          

  <div className="file-field input-field" style={{margin:"10px"}} >
                <div className="btn #64b5f6 blue darken-1">
                    <span>Update Pic
                    </span>
                    <input type="file" 
                    onChange={(e)=>{setImage(e.target.files[0])}}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            </div>
            <div className="gallery">
                {
                    myPics.map((item) => {
                        return (
                            <img key={item._id} className='item' src={item.photo} alt={item.title} />
                        )
                    })
                }

            </div>
        </div>
    )
}

export default Profile