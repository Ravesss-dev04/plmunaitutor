"use client";
import { useState } from "react";
import { FileText, Video, Edit, Trash2, Plus } from "lucide-react";

const LessonMaterialsTable = ({ courseId }) => {
  const [lessons, setLessons] = useState([
    { id: 1, title: "Intro to React", type: "Video", date: "2025-10-20", status: "Published" },
    { id: 2, title: "JSX and Components", type: "Document", date: "2025-10-22", status: "Draft" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: "",
    type: "Video",
    status: "Draft",
  });

  const addLesson = () => {
    if (!newLesson.title.trim()) return alert("Please add a title");
    const updated = [
      ...lessons,
      { id: lessons.length + 1, ...newLesson, date: new Date().toISOString().split("T")[0] },
    ];
    setLessons(updated);
    setShowForm(false);
    setNewLesson({ title: "", type: "Video", status: "Draft" });
  };

  return (
    <div className="bg-[#161b22] p-6 rounded-lg border border-gray-800 mt-4 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-green-500 text-lg font-semibold">Lesson Materials</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto"
        >
          <Plus size={16} /> Add Lesson
        </button>
      </div>

      {/* Add Lesson Form */}
      {showForm && (
        <div className="bg-[#1c2128] p-4 rounded-md border border-gray-700 mb-4">
          <h3 className="text-gray-300 text-sm mb-2 font-semibold">Add New Lesson</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input
              type="text"
              placeholder="Lesson Title"
              value={newLesson.title}
              onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
              className="p-2 rounded bg-[#0d1117] text-gray-200 border border-gray-700 text-sm"
            />
            <select
              value={newLesson.type}
              onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value })}
              className="p-2 rounded bg-[#0d1117] text-gray-200 border border-gray-700 text-sm"
            >
              <option>Video</option>
              <option>Document</option>
              <option>PDF</option>
              <option>Link</option>
            </select>
            <select
              value={newLesson.status}
              onChange={(e) => setNewLesson({ ...newLesson, status: e.target.value })}
              className="p-2 rounded bg-[#0d1117] text-gray-200 border border-gray-700 text-sm"
            >
              <option>Draft</option>
              <option>Published</option>
            </select>
          </div>
          <button
            onClick={addLesson}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm text-white"
          >
            Save Lesson
          </button>
        </div>
      )}

      {/* Table for Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-gray-300 text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 uppercase text-xs">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Date Created</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson.id} className="border-b border-gray-800 hover:bg-[#1c2128] transition">
                <td className="py-3 px-4">{lesson.title}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  {lesson.type === "Video" ? (
                    <Video size={16} className="text-green-500" />
                  ) : (
                    <FileText size={16} className="text-green-500" />
                  )}
                  {lesson.type}
                </td>
                <td className="py-3 px-4">{lesson.date}</td>
                <td
                  className={`py-3 px-4 ${
                    lesson.status === "Published" ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {lesson.status}
                </td>
                <td className="py-3 px-4 text-right flex justify-end gap-3">
                  <button className="hover:text-green-500">
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setLessons(lessons.filter((l) => l.id !== lesson.id))}
                    className="hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card Layout for Mobile */}
      <div className="md:hidden space-y-3">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-[#1c2128] p-4 rounded-md border border-gray-700 flex flex-col gap-2 text-sm"
          >
            <p className="font-semibold text-gray-100">{lesson.title}</p>
            <div className="flex justify-between items-center text-gray-400">
              <span className="flex items-center gap-1">
                {lesson.type === "Video" ? (
                  <Video size={14} className="text-green-500" />
                ) : (
                  <FileText size={14} className="text-green-500" />
                )}
                {lesson.type}
              </span>
              <span className="text-xs">{lesson.date}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span
                className={`text-xs ${
                  lesson.status === "Published" ? "text-green-500" : "text-gray-400"
                }`}
              >
                {lesson.status}
              </span>
              <div className="flex gap-3">
                <button className="hover:text-green-500">
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => setLessons(lessons.filter((l) => l.id !== lesson.id))}
                  className="hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonMaterialsTable;
