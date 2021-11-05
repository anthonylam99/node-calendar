import express from "express";
import getCookie from "../controllers/getCookie";
import optionGetCookie from "../controllers/getCookie";
import getFile from "../controllers/getFile";
import loginController from "../controllers/loginController";
import readFileExcel from "../controllers/readFile";
import testController from '../controllers/testController'

let router = express.Router();

let initWebRouter = (app) => {
  router.get("/", testController.helloWorld);
  router.post('/get-file', getFile.getFile)
  router.post('/read-file', readFileExcel.readFile)
  router.post('/login',loginController.login)
  return app.use("/", router);
};

module.exports = initWebRouter;
