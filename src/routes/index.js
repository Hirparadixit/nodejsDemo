import express from "express"
import { createuser, loginUser } from "../controllers/usercontroller";



const route = express.Router();
// const apiRoutes = express.Router();
// route.use("/api", apiRoutes);

route.post("/createUser", createuser);
route.post("/loginUser", loginUser);
export default route;