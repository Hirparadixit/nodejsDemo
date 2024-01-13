import { pool } from "../helpers/db";

let createTable = `
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    roleName VARCHAR(255) UNIQUE,
    modify_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_by INTEGER REFERENCES users(user_id),
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id)
  );

  CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(role_id),
    firstname VARCHAR(255) ,
    profilephoto VARCHAR(500),
    lastname VARCHAR(255) ,
    email VARCHAR(255) ,
    phonenumber VARCHAR(255),
    password VARCHAR(255) ,
    modify_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
     );

  CREATE TABLE IF NOT EXISTS assignment (
    assign_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    description VARCHAR(255),
    modify_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id)
  );

`;
pool.query(createTable, function (err, result, field) {
    if (err) {
        console.log(err.message);
    }
});

export { pool };