import { useEffect, useState } from "react";
import API from "../services/api";

export default function HODDashboard() {
  const [requests, setRequests] = useState([]);

  const fetchData = async () => {
    const res = await API.get("/request/pending");
    setRequests(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approve = async (id) => {
    await API.put(`/request/${id}/approve`);
    fetchData();
  };

  const reject = async (id) => {
    await API.put(`/request/${id}/reject`);
    fetchData();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">HOD Dashboard</h1>

      {requests.map((r) => (
        <div key={r._id} className="border p-3 mb-2">
          <p>{r.vehicleFor}</p>
          <p>{r.journeyDetails}</p>

          <button
            onClick={() => approve(r._id)}
            className="bg-green-500 text-white p-1 mr-2"
          >
            Approve
          </button>

          <button
            onClick={() => reject(r._id)}
            className="bg-red-500 text-white p-1"
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}