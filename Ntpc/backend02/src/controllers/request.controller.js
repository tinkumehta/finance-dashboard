import VehicleRequest from "../models/VehicleRequest.js";

export const createRequest = async (req, res) => {
    const data = req.body;

    const request = await VehicleRequest.create({
        ...data,
        employeeId: req.user.id,
        status: "PENDING"
    });

    res.json(request);
};

export const getMyRequests = async (req, res) => {
    const requests = await VehicleRequest.find({
        employeeId: req.user.id
    });

    res.json(requests);
};

export const getPendingRequests = async (req, res) => {
    const requests = await VehicleRequest.find({ status: "PENDING" });
    res.json(requests);
};

export const approveRequest = async (req, res) => {
    const request = await VehicleRequest.findById(req.params.id);

    request.status = "APPROVED";
    request.approvedBy = req.user.id;
    request.approvedAt = new Date();

    await request.save();

    res.json(request);
};

export const rejectRequest = async (req, res) => {
    const request = await VehicleRequest.findById(req.params.id);

    request.status = "REJECTED";
    await request.save();

    res.json(request);
};