import { pool } from "../model/modules";
import { successResponse, errorResponse } from "../helpers/responseHelper.js";
import { globalMessage, alertMessage } from "../helpers/messageHelper.js";
import { encryptPassword } from "../helpers/PassWordHash/encryptPassword.js"
import { generateAccessToken, generateIdToken } from "../helpers/jwthelper.js";
import bcrypt from "bcrypt";



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