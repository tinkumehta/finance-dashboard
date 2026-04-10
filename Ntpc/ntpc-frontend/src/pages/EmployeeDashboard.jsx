import { useEffect, useState } from "react";
import API from "../services/api";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import VehicleSlip from "../components/VehicleSlip";

export default function EmployeeDashboard() {
  const [requests, setRequests] = useState([]);
  
  const [form, setForm] = useState({
    employeeName: "",
    vehicleFor: "",
    journeyDetails: "",
  });

  const fetchRequests = async () => {
    const res = await API.get("/request/my");
    setRequests(res.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const submitRequest = async () => {
    await API.post("/request", form);
    fetchRequests();
  };


  const componentRef = useRef();

const [selected, setSelected] = useState(null);

const handlePrint = useReactToPrint({
  contentRef: componentRef,
});


useEffect(() => {
  if (selected) {
    setTimeout(() => {
      handlePrint();
    }, 200); // give React time to render
  }
}, [selected]);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Employee Dashboard</h1>

      <div className="mb-6">
        <input
          placeholder="Vehicle For"
          onChange={(e) => setForm({ ...form, vehicleFor: e.target.value })}
          className="border p-2 mr-2"
        />

        <input
          placeholder="Journey Details"
          onChange={(e) => setForm({ ...form, journeyDetails: e.target.value })}
          className="border p-2 mr-2"
        />

   <button onClick={submitRequest} className="bg-green-500 text-white p-2"> Submit </button>
      </div>

      <h2>My Requests</h2>

  {requests.map((r) => (
  <div key={r._id}>
    <p>{r.vehicleFor} - {r.status}</p>

    {r.status === "APPROVED" && (
      <button onClick={() => setSelected(r)}>
        Print Slip
      </button>
    )}
  </div>
))}

{/* SINGLE hidden print component */}
<div style={{ display: "none" }}>
  <div ref={componentRef}>
    <VehicleSlip data={selected} />
  </div>
</div>
    </div>
  );
}