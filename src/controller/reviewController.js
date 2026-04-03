const reviewSchema = require("../models/reviewModel")


const createReview = async (req,res)=>{
    try{

        const savedReview = await reviewSchema.create(req.body)

        res.status(201).json({
            message:"Review created successfully",
            data:savedReview
        })

    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}



const getReviews = async(req,res)=>{
    try{

        const reviews = await reviewSchema.find().populate("user_id").populate("pg_id")

        res.status(200).json({
            message:"Reviews fetched successfully",
            data:reviews
        })

    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}



const updateReview = async(req,res)=>{
    try{

        const updatedReview = await reviewSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )

        res.status(200).json({
            message:"Review updated successfully",
            data:updatedReview
        })

    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}


const deleteReview = async(req,res)=>{
    try{

        const deletedReview = await reviewSchema.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message:"Review deleted successfully",
            data:deletedReview
        })

    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}

module.exports={
    createReview,
    getReviews,
    updateReview,
    deleteReview
}