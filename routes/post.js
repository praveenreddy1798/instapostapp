const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.get('/allposts',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/subscribedposts',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.post('/createpost',requireLogin,(req,res) => {
    const {title,body,pic} = req.body
    if(!title || !body || !pic ){
       return res.status(422).json({error:"Add required fields"})
    }
    req.user.password = undefined
    
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({result})
    })
    .catch(err=>{
        console.log(err)
    })
    
})
router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name pic")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id},
    },{
        new:true,

    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true,

    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })
})


router.put('/comment',requireLogin,(req,res)=>{

    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment},
    },{
        new:true,

    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })
})
router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        // 
        else{
            post.remove()
            const result=post
            res.json(result)
        }
            
        })
      

})

router.delete("/deletecomment/:postId/:comment_id", requireLogin, (req,res) => {
    const comment = { _id: req.params.comment_id };
    Post.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: { comments: comment },
      },
      {
        new: true, 
      }
    )
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
      .exec((err, postComment) => {
        if (err || !postComment) {
          return res.status(422).json({ error: err });
        } else {
         
          const result = postComment;
          res.json(result);
        }
      });
  });

  router.post('/editpost/:postId',(req,res) => {
  const{title,body,photo} = req.body
    if(!title || !body || !photo ){
       return res.status(422).json({error:"Add required fields"})
    }
    Post.findByIdAndUpdate(req.params.postId,{$set:{title:req.body.title,
        body:req.body.body,
        photo:req.body.photo}},{new:true},
        (err,result)=>{
            if(err){
                return res.json({error:err})
            }
            return res.json(result)

        }
    )
    }
) 
   


  






    module.exports=router