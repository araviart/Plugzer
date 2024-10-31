import multer, {Multer} from 'multer';

const diskStorage = multer.diskStorage({
  destination(req, file, cb) {
      cb(null, "/tmp/my-uploads");
  },
  filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}`);
  },
});

const diskUpload: Multer = multer({ storage: diskStorage });

// const customUpload = multer({ storage: storage });