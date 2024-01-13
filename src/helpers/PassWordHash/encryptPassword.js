import bcrypt from 'bcrypt';

export const encryptPassword = (password) => {
    let salt = bcrypt.genSaltSync(10);
    let hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword;
};