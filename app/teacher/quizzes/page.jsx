"use client";
import { useState } from "react";
import {
  FileCheck2,
  Trash2,
  Edit,
  PlusCircle,
  Calendar,
  Users,
} from "lucide-react";

const QuizzesAndAssessment = () => {
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: "React Basics Quiz",
      questions: 10,
      dateCreated: "2025-10-26",
      status: "Published",
      enrolled: 30,
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      questions: 8,
      dateCreated: "2025-10-24",
      status: "Draft",
      enrolled: 25,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    questions: "",
    status: "Draft",
  });

  const handleAddQuiz = () => {
    if (!newQuiz.title || !newQuiz.questions) return;
    const quiz = {
      id: quizzes.length + 1,
      ...newQuiz,
      dateCreated: new Date().toISOString().split("T")[0],
      enrolled: 0,
    };
    setQuizzes([...quizzes, quiz]);
    setNewQuiz({ title: "", questions: "", status: "Draft" });
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
  };

  const handleEdit = (id) => {
    alert(`Editing quiz with ID: ${id} (functionality next phase)`);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 p-4 md:p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-green-500 mb-2">
        Quizzes & Assessments
      </h1>
      <p className="text-gray-400 mb-6 text-sm">
        Manage your quizzes, track assessments, and monitor student performance.
      </p>

      {/* Add Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <h2 className="text-lg font-semibold text-gray-300">
          Quiz Management
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto"
        >
          <PlusCircle size={16} /> Add Quiz
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-800 rounded-md min-w-[600px]">
          <thead>
            <tr className="bg-[#161b22] text-gray-400 uppercase text-xs border-b border-gray-800">
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Questions</th>
              <th className="py-3 px-4 text-left">Date Created</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Students</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr
                key={quiz.id}
                className="border-b border-gray-800 hover:bg-[#1a1f26] transition"
              >
                <td className="py-3 px-4">{quiz.title}</td>
                <td className="py-3 px-4">{quiz.questions}</td>
                <td className="py-3 px-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {quiz.dateCreated}
                  </div>
                </td>
                <td
                  className={`py-3 px-4 text-sm font-semibold ${
                    quiz.status === "Published"
                      ? "text-green-500"
                      : "text-yellow-400"
                  }`}
                >
                  {quiz.status}
                </td>
                <td className="py-3 px-4 text-sm text-gray-300 flex items-center gap-2">
                  <Users size={14} /> {quiz.enrolled}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEdit(quiz.id)}
                      className="text-gray-400 hover:text-green-500 transition"
                      aria-label="Edit Quiz"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                      aria-label="Delete Quiz"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Quiz Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-[#161b22] p-6 rounded-lg border border-gray-800 w-full max-w-md relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold text-green-500 mb-4">
              Add New Quiz
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={newQuiz.title}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, title: e.target.value })
                  }
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-600"
                  placeholder="Enter quiz title..."
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 block">
                  Number of Questions
                </label>
                <input
                  type="number"
                  value={newQuiz.questions}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, questions: e.target.value })
                  }
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-600"
                  placeholder="e.g., 10"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 block">
                  Status
                </label>
                <select
                  value={newQuiz.status}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, status: e.target.value })
                  }
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-600"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <button
                onClick={handleAddQuiz}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium mt-2"
              >
                Save Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizzesAndAssessment;
