const mongoose= require('mongoose')
const Schema= mongoose.Schema

const bookingSchema= new Schema({
    booking_id:{
        type:Number
    },
    booking_date:{
        type:Date
    },
    status:{
        type:String,
        enum:["active","cancelled"],
        default:"active"
    },
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    pg_id:{
        type:mongoose.Types.ObjectId,
        ref:"pgs"
    }
})
module.exports= mongoose.model("bookings",bookingSchema)