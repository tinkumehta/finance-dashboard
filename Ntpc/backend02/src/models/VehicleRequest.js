import mongoose from "mongoose";

const vehicleRequestSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    employeeName: String,
    designation: String,

    vehicleFor: String,
    journeyDetails: String,
    journeyBy: String,

    dateTime: Date,
    pickupLocation: String,
    returnTime: String,

    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },

    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    approvedAt: Date

}, { timestamps: true });

export default mongoose.model("VehicleRequest", vehicleRequestSchema);