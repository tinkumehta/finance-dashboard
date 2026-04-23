import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { useReactToPrint } from "react-to-print";
import VehicleSlip from "../components/VehicleSlip";

import {
  Car,
  User,
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Hourglass,
  RefreshCw
} from "lucide-react";

export default function EmployeeDashboard() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    employeeName: "",
    designation: "",
    vehicleFor: "",
    journeyDetails: "",
    journeyBy: "",
    dateTime: "",
    pickupLocation: "",
    returnTime: "",
  });

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  useEffect(() => {
    if (selected) {
      setTimeout(() => {
        handlePrint();
        setSelected(null);
      }, 200);
    }
  }, [selected]);

  const fetchRequests = async () => {
    const res = await API.get("/request/my");
    setRequests(res.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const submitRequest = async () => {
    if (!form.employeeName || !form.vehicleFor) return;

    await API.post("/request", form);
    fetchRequests();

    setForm({
      employeeName: "",
      designation: "",
      vehicleFor: "",
      journeyDetails: "",
      journeyBy: "",
      dateTime: "",
      pickupLocation: "",
      returnTime: "",
    });
  };

  const inputClass =
    "w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass = "text-xs text-gray-500 font-medium mb-1 block";

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-50 text-green-700";
      case "PENDING":
        return "bg-yellow-50 text-yellow-700";
      case "REJECTED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Car className="text-blue-600" />
          <span className="font-semibold">VehicleMS</span>
        </div>

        <button onClick={fetchRequests}>
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-6">

        {/* Header */}
        <h1 className="text-lg font-semibold mb-4">Employee Dashboard</h1>

        {/* Form */}
        <div className="bg-white p-5 rounded-xl border mb-6">
          <h2 className="text-sm font-semibold mb-4">New Request</h2>

          <div className="grid md:grid-cols-3 gap-4">

            <div>
              <label className={labelClass}>Employee Name</label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 w-4 text-gray-400" />
                <input
                  value={form.employeeName}
                  onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Designation</label>
              <div className="relative">
                <Briefcase className="absolute left-2 top-2.5 w-4 text-gray-400" />
                <input
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Vehicle For</label>
              <div className="relative">
                <Car className="absolute left-2 top-2.5 w-4 text-gray-400" />
                <input
                  value={form.vehicleFor}
                  onChange={(e) => setForm({ ...form, vehicleFor: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Journey</label>
              <div className="relative">
                <MapPin className="absolute left-2 top-2.5 w-4 text-gray-400" />
                <input
                  value={form.journeyDetails}
                  onChange={(e) => setForm({ ...form, journeyDetails: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Date & Time</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 w-4 text-gray-400" />
                <input
                  type="datetime-local"
                  value={form.dateTime}
                  onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Return Time</label>
              <div className="relative">
                <Clock className="absolute left-2 top-2.5 w-4 text-gray-400" />
                <input
                  type="time"
                  value={form.returnTime}
                  onChange={(e) => setForm({ ...form, returnTime: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

          </div>

          <button
            onClick={submitRequest}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Submit Request
          </button>
        </div>

        {/* Requests */}
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r._id} className="bg-white p-4 border rounded-lg">

              <div className="flex justify-between mb-2">
                <h3 className="font-medium">{r.vehicleFor}</h3>

                <span className={`text-xs px-2 py-1 rounded ${getStatusStyle(r.status)}`}>
                  {r.status === "APPROVED" && <CheckCircle className="inline w-3 mr-1" />}
                  {r.status === "PENDING" && <Hourglass className="inline w-3 mr-1" />}
                  {r.status === "REJECTED" && <XCircle className="inline w-3 mr-1" />}
                  {r.status}
                </span>
              </div>

              <p className="text-xs text-gray-500">{r.journeyDetails}</p>

              {r.status === "APPROVED" && (
                <button
                  onClick={() => setSelected(r)}
                  className="mt-3 text-sm bg-green-600 text-white px-3 py-1 rounded"
                >
                  Print Slip
                </button>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Hidden Print */}
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <VehicleSlip data={selected} />
        </div>
      </div>
    </div>
  );
}