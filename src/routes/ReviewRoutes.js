const router = require("express").Router()
const reviewController = require("../controller/reviewController")


router.post("/review", reviewController.createReview)


router.get("/reviews", reviewController.getReviews)


router.put("/review/:id", reviewController.updateReview)


router.delete("/review/:id", reviewController.deleteReview)

module.exports = router