const router = require("express").Router()
const paymentController = require("../controller/PaymentController")

router.post("/payment", paymentController.createPayment)

router.get("/payments", paymentController.getPayments)


router.put("/payment/:id", paymentController.updatePayment)

router.delete("/payment/:id", paymentController.deletePayment)

module.exports = router