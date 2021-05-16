import express from 'express'
import multer from 'multer'
import path from 'path'
const router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}=${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

function isValidFileType(file) {
  const filetypes = /jpg|jpeg|png/
  const filemimetypes = /image\/jpeg|image\/png/
  const isValidExtname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  )
  const isValidMimetype = filemimetypes.test(file.mimetype) //warning: browser sending mime type based on file extension. Use multer v2 to detect mime type
  if (!isValidExtname || !isValidMimetype) {
    return false
  }
  return true
}

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //5MB
  },
  fileFilter: function (req, file, cb) {
    if (!isValidFileType(file))
      return cb(new Error('Only jpg or png files allowed'), false) //error

    return cb(null, true) //file accepted
  },
})

const errorHandler = (err, req, res, next) => {
  //error handler gets called only when catches error
  if (err instanceof multer.MulterError) {
    res.status(400)
  }
  throw err
}

router.post('/', upload.single('image'), errorHandler, (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error('Please select file') //catch by custom error handler
    //next(new Error('Please select file')) //mandatory if inside async function otherwise use express-async-handler which will also redirect implicit errors to custom error handler
  }

  res.send(`/${req.file.path.replace('\\', '/')}`) //replace '\' with '/' because windows supports '\' as directory separator
})

export default router
