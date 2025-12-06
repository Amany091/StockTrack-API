const multer = require('multer');
const {v2: cloudinary} = require('cloudinary');
const {CloudinaryStorage} = require('multer-storage-cloudinary')

// const multerStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb( null, `uploads/products`);
//     },
//     filename: function (req, file, cb) {
//         const ext = file.mimetype.split("/")[1]
//         const fileName = `product-${uuidv4()}-${Date.now()}.${ext}`;  
//         cb(null, fileName)
//     }
// });

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'products',
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
});

const upload = multer({storage});

const uploadImage = upload.single('imgCover')

module.exports = {uploadImage};

