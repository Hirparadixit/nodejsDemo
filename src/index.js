import express from "express";
import dotenv from "dotenv";
import route from "./routes";
import multer from "multer";
import path from 'path'
import fs from "fs"

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));





app.use(route);

const ensureDirectoryExists = (directory) => {
    const dirPath = path.join('uploads', directory);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  };
  

app.post('/upload/:directory/:field', (req, res) => {
    const params = req.params;
    const { directory, field } = params;
    ensureDirectoryExists(directory);

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/' + directory + '/');
        },
        filename: function (req, file, cb) {
            cb(
                null,
                Date.now() +
                Math.floor(Math.random() * 9999) +
                path.extname(file.originalname)
            );
        },
    });

    const upload = multer({ storage: storage }).single(field);

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ error: true, message: err.message });
        } else if (err) {
            return res.status(500).send({ error: true, message: 'Internal Server Error' });
        }

        if (req.file && req.file.filename) {
            req.file.filename = '/' + directory + '/' + req.file.filename;
            res.send({ data: req.file, success: true });
        }
    });
});



const port = process.env.port;
let server = app.listen(port, () => {
    try {
        console.log("Sucessfully Server started on" + port);
    } catch (error) {
        console.log(error)
    }
});

