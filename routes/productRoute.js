const { createProduct, getAllProducts, getProduct, deleteProduct, updateProduct, deleteAllProducts } = require("../controllers/productController")
const { authentication } = require("../middlewares/authMiddleware")
const {  updateProductValidator, deleteProductValidator, getProductValidator } = require("../validators/productValidator")
const {uploadImage} = require("../middlewares/uploadImgMiddleware")

const router = require("express").Router()

router.route("/").post(uploadImage,createProduct)
    .get(getAllProducts)
    .delete(authentication, deleteAllProducts)
    
                
router.route("/:id").put(authentication ,updateProductValidator,updateProduct) 
                    .delete(authentication ,deleteProductValidator,deleteProduct)
                    .get(getProductValidator,getProduct)                

module.exports = router