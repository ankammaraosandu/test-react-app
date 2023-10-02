const postModel = require("../models/postModel");

const createPostController =async(req,res) =>{
    try {
        const {title,description} =req.body
        if(!title||!description){
            return res.status(500).send({
                success:false,
                message:"fill all fields"
            })
        }
        const post = await postModel({
            title,
            description,
            postedBy:req.auth._id
        }).save();
        res.status(201).send({
            success:true,
            message:'post created',
            post,
        })
        console.log(req)
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error',
            error
        })
        
    }
};
const getAllPostsController = async(req,res) => {
    try {
        const posts = await postModel.find().populate('postedBy',"_id name").sort({createdAt: -1})
        res.status(200).send({
            success:true,
            message:"all data",
            posts,
        })
        
    } catch (error) {
        console.log(error)
        req.status(500).send({
            success:false,
            message:"error",
            error
        })
        
    }

};

const getUserPostController = async(req,res) =>{
    try {
        const userPosts = await postModel.find({postedBy:req.auth._id})
        res.status(200).send({
            success:true,
            message:'user post',
            userPosts
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"error",
            error
        })
        
    }
}
const deletePostController = async(req,res) =>{
    try {
        const {id} =req.params
        await postModel.findByIdAndDelete({_id:id})
        res.status(200).send({
            success:true,
            message:'deleted',
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error',
            error
        })
        
    }
}
const updatePostController = async (req, res) => {
    try {
      const { title, description } = req.body;
      //post find
      const post = await postModel.findById({ _id: req.params.id });
      //validation
      if (!title || !description) {
        return res.status(500).send({
          success: false,
          message: "Please Provide post title or description",
        });
      }
      const updatedPost = await postModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
          title: title || post?.title,
          description: description || post?.description,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Post Updated Successfully",
        updatedPost,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Errro in update post api",
        error,
      });
    }
  };
module.exports ={createPostController,getAllPostsController,getUserPostController,deletePostController,updatePostController}