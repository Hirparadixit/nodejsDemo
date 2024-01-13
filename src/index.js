import express from "express";
import dotenv from "dotenv";
import route from "./routes";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(route);

const port = process.env.port;

let server = app.listen(port, () => {
    try {
        console.log("Sucessfully Server started on" + port);
    } catch (error) {
        console.log(error)
    }

})