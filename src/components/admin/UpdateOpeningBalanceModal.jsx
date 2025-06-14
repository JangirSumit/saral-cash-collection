import React, { useState } from "react";
import { apiBase } from "../../lib/apiBase";

export default function UpdateOpeningBalanceModal({
  handleOpeningBalanceModalClose,
  selectedUserId,
}) {
  const [openingBalance, setOpeningBalance] = useState("");
  const [openingBalanceDate, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSave = async () => {
    console.log("Saving for user:", selectedUserId, {
      openingBalance,
      openingBalanceDate,
    });

    const result = await apiBase.updateOpeningBalanceData(
      selectedUserId,
      openingBalance,
      openingBalanceDate
    );
    if (!result?.Response) {
      alert("Failed to update opening balance");
      return;
    }
    handleOpeningBalanceModalClose(openingBalance, openingBalanceDate);
  };
  console.log("Selected User ID:", selectedUserId);
  if (!selectedUserId) {
    return "";
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          width: "400px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>Update Opening Balance</h3>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="opening-balance">Id</label>
          <input
            disabled
            type="text"
            id="id"
            value={`${selectedUserId}`}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            className="date-picker border-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="opening-balance">Opening Balance</label>
          <input
            type="number"
            id="opening-balance"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            className="date-picker border-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={openingBalanceDate}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            className="date-picker border-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
        >
          <button
            onClick={() => handleOpeningBalanceModalClose(null, null)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#ccc",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
