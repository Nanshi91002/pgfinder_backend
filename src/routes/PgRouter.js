const router= require('express').Router()
const pgController=require("../controller/PgController")
router.post("/pg",pgController.createPg)
router.get("/pg",pgController.getPg)
router.put("/pg",pgController.updatePg)
router.delete("/pg/:id",pgController.deletePg)
module.exports=router