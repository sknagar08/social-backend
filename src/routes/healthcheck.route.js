import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";

export const healthcheckRouter = Router();

healthcheckRouter.route("/").get(healthcheck);
