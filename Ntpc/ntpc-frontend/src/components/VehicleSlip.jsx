import React from "react";

export default function VehicleSlip({ data }) {
  if (!data) return null;

  return (
    <div className="p-8 bg-white text-black w-[800px] mx-auto border">

      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="font-bold m-50">NTPC Limited</h2>
        <p>Chatti Bariatu Coal Mining Project</p>
        <p>(Human Resource Department)</p>
        <h3 className="font-bold mt-2">VEHICLE REQUISITION SLIP</h3>
      </div>

      {/* Table */}
      <table className="w-full border border-black text-sm">
        <tbody>

          <tr className="border">
            <td className="border p-2">Name of Employee</td>
            <td className="border p-2">{data.employeeName}</td>
          </tr>

          <tr>
            <td className="border p-2">Designation</td>
            <td className="border p-2">{data.designation}</td>
          </tr>

          <tr>
            <td className="border p-2">Vehicle Required For</td>
            <td className="border p-2">{data.vehicleFor}</td>
          </tr>

          <tr>
            <td className="border p-2">Journey Details</td>
            <td className="border p-2">{data.journeyDetails}</td>
          </tr>

          <tr>
            <td className="border p-2">Journey By</td>
            <td className="border p-2">{data.journeyBy}</td>
          </tr>

          <tr>
            <td className="border p-2">Date & Time</td>
            <td className="border p-2">
              {new Date(data.dateTime).toLocaleString()}
            </td>
          </tr>

          <tr>
            <td className="border p-2">Pickup Location</td>
            <td className="border p-2">{data.pickupLocation}</td>
          </tr>

          <tr>
            <td className="border p-2">Return Time</td>
            <td className="border p-2">{data.returnTime}</td>
          </tr>

        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-10 flex justify-between text-sm">
        <div>
          <p>Employee Signature</p>
        </div>

        <div>
          <p>HOD Approval</p>
          <p className="text-green-600 font-bold">APPROVED</p>
        </div>
      </div>
    </div>
  );
}