import React, { useEffect, useState } from "react";
import { apiBase } from "../../lib/apiBase";
import { formatIndianNumber } from "../../lib/utils";
import LedgerModal from "../../components/LedgerModal";

const columns = [
  { key: "Id", label: "ID", width: "50px" },
  { key: "CollectorName", label: "Collector", width: "150px" },
  { key: "Amount", label: "Amount", width: "100px" },
  { key: "TransactionTypes", label: "Transaction Type", width: "120px" },
  { key: "WorkFlows", label: "Workflow", width: "120px" },
  { key: "Date", label: "Transaction Date", width: "100px" },
  { key: "GivenOn", label: "Given On", width: "100px" },
  { key: "Comment", label: "Remarks", width: "150px" },
];

export default function RetailDashboard({ retailUserId = "RU00118" }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [liability, setLiability] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [masterData, setMasterData] = useState(null);
  const [collectors, setCollectors] = useState([]);
  const [filters, setFilters] = useState({
    CollectorId: "",
    Amount: "",
    TransactionTypes: "",
    WorkFlows: "",
    Date: "",
    GivenOn: "",
    Comment: "",
  });

  // Load master data once on mount
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const data = await apiBase.getMasterData();
        setMasterData(data);
      } catch (err) {
        console.error("Failed to load master data:", err);
      }
    };

    loadMasterData();
  }, []);

  const fetchData = async (date) => {
    if (!retailUserId || !date) return;

    try {
      const [ledgerData, liabilityData, collectors] = await Promise.all([
        apiBase.getLadgerInfoByRetailerid(date, retailUserId),
        apiBase.GetLiabilityAmountByRetailerId(retailUserId, date),
        apiBase.getMappedCollectorsByRetailerId(retailUserId),
      ]);

      setCollectors(collectors);
      setLiability(liabilityData);
      setLedger(ledgerData);
    } catch (err) {
      console.error("Error:", err);
      setLiability(null);
      setLedger(null);
    }
  };

  const getMasterValue = (type, id) => {
    const list = masterData?.[type] || [];
    return list.find((x) => x.Id == id)?.Description || id;
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const openAddLedger = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const openEditLedger = (data) => {
    setEditData(data);
    setModalOpen(true);
  };

  const handleLedgerSubmit = async (data) => {
    try {
      data.RetailerId = retailUserId;
      const payload = {
        ...data,
        Amount: parseFloat(data.Amount),
        TransactionType: parseInt(data.TransactionType),
        WorkFlow: parseInt(data.WorkFlow),
        Date: new Date(data.Date).toISOString(),
        GivenOn: new Date(data.GivenOn).toISOString(),
      };

      if (editData?.Id) {
        await apiBase.updateLedgerInfo(payload);
      } else {
        await apiBase.addLedgeInfo(payload);
      }

      await fetchData(selectedDate);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const filteredData = (ledger || []).filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (key === "WorkFlows") {
        key = "WorkFlow";
      } else if (key === "TransactionTypes") {
        key = "TransactionType";
      }

      if (!value) return true;
      const itemValue = item[key];
      if (itemValue === null || itemValue === undefined) return false;
      return itemValue.toString().toLowerCase().includes(value.toLowerCase());
    });
  });

  const totalLedgerAmount = (ledger || []).reduce((sum, item) => sum + (item.Amount || 0), 0);

  const approvedAmount = (ledger || [])
    .filter((item) => {
      const approvedId = masterData?.WorkFlows?.find(x => x.Description.toLowerCase() === "approved")?.Id;
      return item.WorkFlow === approvedId;
    })
    .reduce((sum, item) => sum + (item.Amount || 0), 0);

  const computedStatus =
    liability && approvedAmount === liability.Amt ? "Approved" : "Pending";

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Retail Dashboard
        </h1>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4 flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded px-2 py-1 border-gray-300"
            />
            <button
              onClick={() => fetchData(selectedDate)}
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          {liability && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div className="bg-white shadow rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">Liability</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    ₹{formatIndianNumber(liability.Amt)}
                  </dd>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">Handover</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    ₹{formatIndianNumber(totalLedgerAmount)}
                  </dd>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">
                    {computedStatus}
                  </dd>
                </div>
              </div>

              <div className="flex justify-end mb-2">
                <button
                  onClick={openAddLedger}
                  className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700"
                >
                  Add Ledger Entry
                </button>
              </div>

              {ledger?.length > 0 && (
                <div className="overflow-y-auto border border-gray-200 rounded max-h-[600px]">
                  <table className="w-full table-auto divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        {columns.map(({ key, label, width }) => (
                          <th
                            key={key}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                            style={{ width, whiteSpace: "nowrap" }}
                          >
                            <div className="flex flex-col min-w-fit">
                              <span>{label}</span>
                              {["TransactionTypes", "WorkFlows"].includes(key) &&
                              masterData ? (
                                <select
                                  value={filters[key]}
                                  onChange={(e) =>
                                    handleFilterChange(key, e.target.value)
                                  }
                                  className="mt-1 px-1 py-0.5 border border-gray-300 rounded text-xs"
                                  style={{ width }}
                                >
                                  <option value="">All</option>
                                  {masterData[key]?.map((opt) => (
                                    <option key={opt.Id} value={opt.Id}>
                                      {opt.Description}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  style={{ width }}
                                  value={filters[key] || ""}
                                  onChange={(e) =>
                                    handleFilterChange(key, e.target.value)
                                  }
                                  className="mt-1 px-1 py-0.5 border border-gray-300 rounded text-xs"
                                  placeholder="Filter"
                                />
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.map((item) => (
                        <tr
                          key={item.Id}
                          onClick={() => openEditLedger(item)}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          <td className="px-2 py-2">{item.Id}</td>
                          <td className="px-2 py-2">{item.CollectorName}</td>
                          <td className="px-2 py-2">
                            ₹{formatIndianNumber(item.Amount)}
                          </td>
                          <td className="px-2 py-2">
                            {getMasterValue(
                              "TransactionTypes",
                              item.TransactionType
                            )}
                          </td>
                          <td className="px-2 py-2">
                            {getMasterValue("WorkFlows", item.WorkFlow)}
                          </td>
                          <td className="px-2 py-2">
                            {new Date(item.Date).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-2">
                            {new Date(item.GivenOn).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-2 break-words max-w-[200px]">
                            {item.Comment}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {!ledger && selectedDate && (
            <div className="text-gray-500 mt-4">
              No data available for selected date.
            </div>
          )}
        </div>
      </div>

      <LedgerModal
        collectors={collectors}
        masterData={masterData}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleLedgerSubmit}
        initialData={editData}
      />
    </>
  );
}
