const paymentSchema = require("../models/paymentModel")

const createRazorpayOrder = async (req, res) => {
    try {
        const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!razorpayKeyId || !razorpayKeySecret) {
            return res.status(500).json({
                message: "Razorpay keys are not configured on the server."
            });
        }

        const amount = Number(req.body?.amount || 0);
        const currency = String(req.body?.currency || "INR");
        const receipt = String(req.body?.receipt || `receipt_${Date.now()}`);
        const notes = Object.fromEntries(
            Object.entries(req.body?.notes || {}).map(([key, value]) => [key, String(value ?? "")])
        );

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                message: "A valid payment amount is required."
            });
        }

        const response = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64")}`
            },
            body: JSON.stringify({
                amount,
                currency,
                receipt,
                notes
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                message: data?.error?.description || data?.error?.reason || "Failed to create Razorpay order.",
                error: data
            });
        }

        return res.status(200).json({
            message: "Razorpay order created successfully",
            key: razorpayKeyId,
            order: data
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Failed to create Razorpay order.",
            error: err
        });
    }
};


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
    createRazorpayOrder,
    getPayments,
    updatePayment,
    deletePayment
}
