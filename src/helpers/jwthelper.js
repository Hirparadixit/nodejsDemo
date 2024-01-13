import jsonwebtoken from "jsonwebtoken";
import { globalMessage } from "./messageHelper";
import { errorResponse } from "./responseHelper";

export const generateAccessToken = (userData) => {
    let token = jsonwebtoken.sign(
        { _id: userData._id },
        process.env.TOKEN_SECRET,
        { expiresIn: '365d' }
    );
    return token;
};
/*---------------- | GENERATE ID TOKEN | ----------------*/
export const generateIdToken = (data) => {
    let token = jsonwebtoken.sign(data, process.env.TOKEN_SECRET, { expiresIn: '365d' });
    return token;
}
export const requireAuthorization = (req, res, next) => {
    let token = req.body.authorization || req.query.authorization || req.headers['authorization'];
    if (!token) {
        return res.status(401).json(errorResponse(401, globalMessage.noToken, {}));
    } else {
        let authToken = token.split(' ');
        if (authToken) {
            if (authToken[0] !== 'Bearer') {
                return res.status(401).json(errorResponse(401, globalMessage.invalidToken, {}));
            } else {
                jsonwebtoken.verify(authToken[1], process.env.TOKEN_SECRET, (err, decoded) => {
                    if (err) {
                        return res.status(401).json(errorResponse(401, globalMessage.invalidToken, {}));
                    } else {
                        req.user = decoded._id;
                        next();
                    }
                });
            }
        } else {
            return res.status(401).json(errorResponse(401, globalMessage.noToken, {}));
        }
    }
};