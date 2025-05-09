import config from "./config.json";

const API_URL = config.api.endpoint; // Default to localhost if not set

let currentUser = null;

export const apiBase = {
  signIn: async (email, password) => {
    const response = await fetch(
      `${API_URL}/Login?userId=${email}&password=${password}`
    );

    let user = await response.json();
    if (!response.ok || user?.IsFailed) {
      console.error(`Failed to fetch: ${response.statusText}`);

      if (!user) {
        throw new Error("Invalid email or password");
      }
    }

    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
    return { user };
  },

  signOut: async () => {
    currentUser = null;
    localStorage.removeItem("currentUser");
  },

  getCurrentUser: () => {
    if (!currentUser) {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        currentUser = JSON.parse(stored);
      }
    }
    return currentUser;
  },

  // ************ Actual API calls ************

  getMasterData: async () => {
    const response = await fetch(`${API_URL}/GetMasterData`);
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  getMappedUsersByCollectorId: async (collectorId) => {
    const response = await fetch(
      `${API_URL}/GetMappedUsersByCollectorId?userId=${collectorId}`
    );
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  getRetailUsers: async () => {
    const response = await fetch(`${API_URL}/GetRetailerUsers`);
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  getCollectors: async () => {
    const response = await fetch(`${API_URL}/GetCollectorUsers`);
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  getCashiers: async () => {
    const response = await fetch(`${API_URL}/GetCashierUsers`);
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  getMappedUsers: async () => {
    const response = await fetch(`${API_URL}/GetMappedUsers`);
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  getMappedCollectorsByRetailerId: async (retailerId) => {
    const response = await fetch(
      `${API_URL}/GetMappedCollectorsByRetailerId?userId=${retailerId}`
    );
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  getLiabilityAmountOfAllRetailers: async (date) => {
    const response = await fetch(
      `${API_URL}/GetLiabilityAmountOfAllRetailers?date=${date}`
    );
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  getLadgerInfosCreatedByCollectors: async (date) => {
    const response = await fetch(
      `${API_URL}/GetLadgerInfosCreatedByCollectors?date=${date}`
    );
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  GetLiabilityAmountByRetailerId: async (retailerId, date) => {
    const response = await fetch(
      `${API_URL}/GetLiabilityAmountByRetailerId?userId=${retailerId}&date=${date}`
    );
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  addLedgerInfo: async (data) => {
    const response = await fetch(`${API_URL}/AddLadgerInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const result = await response.json();
    console.log(result);
    return result;
  },

  updateLedgerInfo: async (data) => {
    const response = await fetch(`${API_URL}/UpdateLadgerInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const result = await response.json();
    console.log(result);
    return result;
  },

  deleteLedgerInfo: async (ledgerId) => {
    const response = await fetch(`${API_URL}/DeleteLadgerInfo?id=${ledgerId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const result = await response.json();
    console.log(result);
    return result;
  },

  getLadgerInfoByRetailerid: async (date, retailerId) => {
    const response = await fetch(
      `${API_URL}/GetLadgerInfoByRetailerid?date=${date}&retailerId=${retailerId}`
    );
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  getLedgerInfoByCollectorId: async (date, collectorId) => {
    const response = await fetch(
      `${API_URL}/GetLadgerInfoByCollectorId?date=${date}&collectorId=${collectorId}`
    );
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  getLadgerInfoByRetaileridAndCollectorId: async (
    date,
    retailerId,
    collectorId
  ) => {
    const response = await fetch(
      `${API_URL}/GetLadgerInfoByRetaileridAndCollectorId?date=${date}&retailerId=${retailerId}&collectorId=${collectorId}`
    );
    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  saveCollectorUser: async (user) => {
    const response = await fetch(`${API_URL}/SaveUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  },

  alignCollectorWithRetailerUser: async (data) => {
    const response = await fetch(`${API_URL}/AlignCollectorWithRetailerUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Failed to fetch: ${response.statusText}`);
    }
    const result = await response.json();
    console.log(result);
    return result;
  },
};
