import multer from "multer";


function defineStorage(path: string) {
  const storage =  multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path); 
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname); 
      }
  });
  return multer({ storage: storage });
}

export default defineStorage;