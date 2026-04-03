const imageSchema=require("../models/ImageModel")
const createImg=async(req,res)=>{
    try{
        const createdImg= await imageSchema.find()
        res.status(200).json({
            message:"image created successfully!!!",
            data:createdImg
        })
    }catch(err){
        res.status(500).json({
            err:err
        })
    }
} 
const getImg=async(req,res)=>{
    try{
        const allImg=await imageSchema.create(req.body)
            res.status(500).json({
                message:"image fetched successfully",
                data:allImg
            })
    
    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}
const updateImg= async(req,res)=>{
    try{
        const updatedImg= await imageSchema.findByIdAndUpdate(
            req.params._id,
            req.body,
            {new:true}
        )
        res.status(200).json({
            message:"image fetched successfully!!!",
            data:updatedImg
        })
    }catch(err){
         res.status(500).json({
            err:err
         })
    }
}
const deleteImg= async(req,res)=>{
    try{
         const deletedImg= await imageSchema.findByIdAndDelete()
         res.status(400).json({
               message:"img deleted!!!!",
               data:deletedImg
         })
    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}

module.exports={createImg,getImg,updateImg,deleteImg}