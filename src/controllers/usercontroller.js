import { pool } from "../model/modules";
import { successResponse, errorResponse } from "../helpers/responseHelper.js";
import { globalMessage, alertMessage } from "../helpers/messageHelper.js";
import { encryptPassword } from "../helpers/PassWordHash/encryptPassword.js"
import { generateAccessToken, generateIdToken } from "../helpers/jwthelper.js";
import bcrypt from "bcrypt";
import path from 'path'
import multer from "multer";
import { date } from "joi";





const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
    },
});

export const upload = multer({
    storage: fileStorageEngine,
    limits: { fileSize: 30000000 },
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extName = filetypes.test(path.extname(file.originalname).toLowerCase());
    // console.log(path.extname(file.originalname).toLowerCase());
    const mimeType = filetypes.test(file.mimetype);
    // console.log(mimeType);
    if (mimeType && extName) {
        return cb(null, true);
    }
    return cb("Error: Images only");
}

export const createuser = async (req, res) => {
    try {
        const { firstname, lastname, email, password, role_id, mobile } = req.body;
        console.log(firstname);
        const hashedPassword = encryptPassword(password);
        const queryString = `
          INSERT INTO users 
           ( firstname, lastname, email, password, role_id, phonenumber) 
            VALUES 
             ($1, $2, $3, $4, $5, $6  ) 
              RETURNING *
              `;

        const result = await pool.query(
            queryString,
            [firstname, lastname, email, hashedPassword, role_id, mobile]
        );

        res.json(successResponse(200, alertMessage.users.createSuccess, result.rows));
    } catch (error) {
        res.json(errorResponse(500, globalMessage.errorMessage, error));
        console.log(error);
    }
}

// export const picUpload = async (req, res) => {
//     try {
//         console.log(req.file);
//         let filname = req.file.path;
//         await res.send("Image uploaded successfully", filname);
//     } catch (e) {
//         res.send(e);
//     }
// };

// export const multiPicUpload = async (req, res) => {
//     try {
//         console.log(req.files);
//         res.send("Images uploaded successfully");
//     } catch (e) {
//         res.send(e);
//     }
// };

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const queryString = `SELECT * FROM USERS WHERE email =$1`;
        const result = await pool.query(
            queryString,
            [email]
        );
        let userData = result.rows[0];
        const jwtTokenAcessData = {
            user_id: userData.user_id,
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            status: userData.status,
            role: userData.role_name
        }
        const accessToken = generateAccessToken(jwtTokenAcessData);
        const idToken = generateIdToken(jwtTokenAcessData);
        const responseData = {
            access_token: accessToken,
            id_token: idToken
        }
        if (!userData || !bcrypt.compareSync(password, userData.password)) {
            res.json(successResponse(401, alertMessage.users.loginError));
        } else {

            res.json(successResponse(200, alertMessage.users.loginSuccess, responseData));
        }
    } catch (error) {
        res.json(errorResponse(500, globalMessage.errorMessage, error));
        console.log(error);
    }
}