import { Router } from "express";
import {
    createRequest,
    getMyRequests,
    getPendingRequests,
    approveRequest,
    rejectRequest
} from "../controllers/request.controller.js";

import { verifyJWT, verifyRole } from "../middlewares/auth.js";

const router = Router();

router.post("/", verifyJWT, verifyRole("EMPLOYEE"), createRequest);
router.get("/my", verifyJWT, getMyRequests);

router.get("/pending", verifyJWT, verifyRole("HOD"), getPendingRequests);
router.put("/:id/approve", verifyJWT, verifyRole("HOD"), approveRequest);
router.put("/:id/reject", verifyJWT, verifyRole("HOD"), rejectRequest);

export default router;