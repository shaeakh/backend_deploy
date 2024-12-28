"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiEdit2, FiPackage, FiPlus, FiTrash2 } from "react-icons/fi";

interface Task {
  id?: number;
  text: string;
  day: string;
  reminder: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Task>({
    text: "",
    day: "",
    reminder: false,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/task");
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/task/${editingId}`, formData);
      } else {
        await axios.post("http://localhost:5000/task", formData);
      }
      fetchTasks();
      setFormData({ text: "", day: "", reminder: false });
      setEditingId(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/task/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task: Task) => {
    setFormData(task);
    setEditingId(task.id!);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Form Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
            <FiPackage className="text-purple-500" />
            {editingId ? "Edit Service" : "Add New Service"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={formData.day}
              onChange={(e) =>
                setFormData({ ...formData, day: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.reminder}
                onChange={(e) =>
                  setFormData({ ...formData, reminder: e.target.checked })
                }
                className="rounded border-gray-200 dark:border-gray-700 text-purple-500 focus:ring-purple-500"
              />
              <label className="text-gray-700 dark:text-gray-200">
                Set Reminder
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  {editingId ? <FiEdit2 /> : <FiPlus />}
                  {editingId ? "Update Task" : "Add Task"}
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {loading
              ? // Skeleton Loading
                [...Array(3)].map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-4" />
                  </motion.div>
                ))
              : tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {task.text}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {task.day}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                        {task.reminder ? "Reminder Set" : "No Reminder"}
                      </span>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(task)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                        >
                          <FiEdit2 />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(task.id!)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                        >
                          <FiTrash2 />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
