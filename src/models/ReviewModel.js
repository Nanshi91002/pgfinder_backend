const mongoose= require('mongoose')
const Schema =mongoose.Schema

const reviewSchema= new Schema({
    review_id:{
        type:Number
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    comment:{
        type:String
    },
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    pg_id:{
        type:mongoose.Types.ObjectId,
        ref:"pg"
    }
})
module.exports= mongoose.model("reviews",reviewSchema)