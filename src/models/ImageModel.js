const mongoose= require('mongoose')
const Schema= mongoose.Schema

const imageSchema= new Schema({
    pg:{
        type:mongoose.Types.ObjectId,
        ref:"pg"
    },
    imageUrl:{
        type:String
    }
})
module.exports= mongoose.model("images",imageSchema)