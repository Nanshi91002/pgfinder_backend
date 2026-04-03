const mongoose= require('mongoose')
const Schema= mongoose.Schema

const paymentSchema= new Schema({
    payment_id:{
        type:Number
    },
    booking_id:{
        type:mongoose.Types.ObjectId,
        ref:"booking"
    },
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    amount:{
        type:Number
    },
    payment_date:{
        type:Date
    },
    payment_method:{
        type:String,
        enum:["cash","upi","card"]
    },
    transcation_id:{
        type:String,
        unique:true
    },
    payment_status:{
        type:String
    }

})
module.exports=mongoose.model("payments",paymentSchema)