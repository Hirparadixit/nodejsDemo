import express from "express"
import { createuser, loginUser } from "../controllers/usercontroller";
import { upload } from "../controllers/usercontroller";
 

const route = express.Router();
// const apiRoutes = express.Router();
// route.use("/api", apiRoutes);

route.post("/createUser", createuser);
route.post("/loginUser", loginUser);
// route.post("/picupload",upload.single('image'), picUpload);
// route.post("/multipicupload",upload.array('images',2), multiPicUpload);
export default route;