// src/api/mockCloudAPI.js

let mockInstances = JSON.parse(localStorage.getItem("mockInstances")) || [
  { id: "w1", name: "Python Workspace", plan: "student", status: "running", url: "#" },
  { id: "w2", name: "DevOps Project", plan: "edu", status: "stopped", url: "#" },
];

let mockUsage = JSON.parse(localStorage.getItem("mockUsage")) || {
  cpuUsed: 3,
  cpuQuota: 8,
  storageUsed: 20,
  storageQuota: 100,
  activeUsers: 4,
};

// Utility to simulate network delay
const delay = (ms = 800) => new Promise((r) => setTimeout(r, ms));

// Save state to localStorage
const saveState = () => {
  localStorage.setItem("mockInstances", JSON.stringify(mockInstances));
  localStorage.setItem("mockUsage", JSON.stringify(mockUsage));
};

export const mockAPI = {
  listInstances: async () => {
    await delay();
    return { instances: mockInstances };
  },

  getUsage: async () => {
    await delay();
    return mockUsage;
  },

  createInstance: async ({ name, plan, image }) => {
    await delay(1200);

    const newId = `w${Date.now()}`;
    const newInstance = {
      id: newId,
      name: name || `Workspace-${mockInstances.length + 1}`,
      plan: plan || "student",
      status: "initializing",
      image: image || "ubuntu",
      url: "#",
    };

    mockInstances = [...mockInstances, newInstance];
    mockUsage.cpuUsed += 1;
    mockUsage.storageUsed += 5;
    saveState();

    // Simulate delayed activation
    setTimeout(() => {
      const idx = mockInstances.findIndex((i) => i.id === newId);
      if (idx !== -1) {
        mockInstances[idx].status = "running";
        saveState();
      }
    }, 2500);

    return newInstance;
  },

  // Support for multiple instance creation
  createInstances: async (config) => {
    const created = [];
    const count = config.count || 1;
    for (let i = 0; i < count; i++) {
      const inst = await mockAPI.createInstance({
        name: `${config.image}-${Date.now()}-${i + 1}`,
        plan: config.plan,
        image: config.image,
      });
      created.push(inst);
    }
    saveState();
    return { instances: created, usage: await mockAPI.getUsage() };
  },

  deleteInstance: async (id) => {
    await delay(600);
    mockInstances = mockInstances.filter((i) => i.id !== id);
    mockUsage.cpuUsed = Math.max(mockUsage.cpuUsed - 1, 0);
    mockUsage.storageUsed = Math.max(mockUsage.storageUsed - 5, 0);
    saveState();
    return { success: true };
  },
};
