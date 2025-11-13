// src/components/simulations/full-stack/MongoDBCrudSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Database, PlusCircle, Eye, Edit, Trash } from "lucide-react";

export default function MongoDBCrudSimulator() {
  const [records, setRecords] = useState([
    { id: 1, name: "Aarav", email: "aarav@example.com", age: 22 },
    { id: 2, name: "Diya", email: "diya@example.com", age: 25 },
  ]);
  const [counter, setCounter] = useState(3);

  const addRecord = () => {
    const newRec = { id: counter, name: `User${counter}`, email: `user${counter}@mail.com`, age: 20 + counter };
    setRecords([...records, newRec]);
    setCounter(counter + 1);
  };

  const updateRecord = (id) => {
    setRecords(records.map((r) => (r.id === id ? { ...r, name: r.name + " ✅" } : r)));
  };

  const deleteRecord = (id) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  return (
    <div className="p-6 mt-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-green-300 dark:border-green-700 shadow-lg">
      <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
        🗄️ MongoDB CRUD Operations Visualizer
      </h2>
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
        This simulator demonstrates how **Create, Read, Update, and Delete** operations modify data in a MongoDB collection.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={addRecord}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          <PlusCircle size={18} /> Create
        </button>
        <button
          onClick={() => alert("Read operation simply fetches data below 👇")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Eye size={18} /> Read
        </button>
      </div>

      {/* Record Display */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
        <table className="min-w-full text-sm text-gray-800 dark:text-gray-200">
          <thead className="bg-green-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <motion.tr
                key={rec.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b dark:border-gray-700"
              >
                <td className="p-3">{rec.id}</td>
                <td className="p-3">{rec.name}</td>
                <td className="p-3">{rec.email}</td>
                <td className="p-3">{rec.age}</td>
                <td className="p-3 text-center flex justify-center gap-2">
                  <button
                    onClick={() => updateRecord(rec.id)}
                    className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => deleteRecord(rec.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    <Trash size={14} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <motion.div
        className="mt-6 text-center text-green-700 dark:text-green-300 font-mono text-sm"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        🔁 Database state updates instantly as you perform CRUD operations.
      </motion.div>
    </div>
  );
}
