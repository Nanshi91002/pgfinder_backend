const paymentSchema = require("../models/paymentModel")


// CREATE PAYMENT
const createPayment = async(req,res)=>{
    try{

        const savedPayment = await paymentSchema.create(req.body)

        res.status(201).json({
            message:"Payment successful",
            data:savedPayment
        })

    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}



const getPayments = async(req,res)=>{
    try{

        const payments = await paymentSchema.find()
        .populate("user_id")
        .populate("booking_id")

        res.status(200).json({
            message:"Payments fetched successfully",
            data:payments
        })

    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}


const updatePayment = async(req,res)=>{
    try{

        const updatedPayment = await paymentSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )

        res.status(200).json({
            message:"Payment updated successfully",
            data:updatedPayment
        })

    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}



const deletePayment = async(req,res)=>{
    try{

        const deletedPayment = await paymentSchema.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message:"Payment deleted successfully",
            data:deletedPayment
        })

    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}

module.exports={
    createPayment,
    getPayments,
    updatePayment,
    deletePayment
}