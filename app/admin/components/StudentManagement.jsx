import React, { useState } from 'react';

const StudentManagement = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Jane Smith',
      email: 'jane@plmun.edu',
      enrolledCourses: 3,
      progress: 80,
      status: 'active',
      assignmentsSubmitted: 12,
      totalAssignments: 15
    },
    {
      id: 2,
      name: 'Mark Lopez',
      email: 'mark@plmun.edu',
      enrolledCourses: 2,
      progress: 60,
      status: 'active',
      assignmentsSubmitted: 9,
      totalAssignments: 15
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter students based on search and status
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const viewProgress = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const deactivateStudent = (studentId) => {
    setStudents(students.map(student =>
      student.id === studentId ? { ...student, status: 'deactivated' } : student
    ));
  };

  const addStudent = () => {
    alert('This will open an Add Student form or modal.');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-green-500 mb-2">
            Student Management
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Monitor student progress, courses, and enrollment activity.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search student name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
          />
          <select
            value={filterStatus}
            onChange={handleFilterChange}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
          >
            <option value="all">All Students</option>
            <option value="active">Active</option>
            <option value="deactivated">Deactivated</option>
          </select>
          <button
            onClick={addStudent}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm md:text-base"
          >
            + Add Student
          </button>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Enrolled Courses
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-750 transition-colors duration-150">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                      {student.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {student.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {student.enrolledCourses}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center gap-3">
                        <div className="w-24 md:w-32 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.status === 'active'
                            ? 'bg-green-900 text-green-200'
                            : 'bg-red-900 text-red-200'
                        }`}
                      >
                        {student.status === 'active' ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => viewProgress(student)}
                          className="text-green-400 hover:text-green-300 transition-colors duration-200 text-xs md:text-sm px-2 py-1 rounded border border-green-400 hover:border-green-300"
                        >
                          View Progress
                        </button>
                        {student.status === 'active' && (
                          <button
                            onClick={() => deactivateStudent(student.id)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200 text-xs md:text-sm px-2 py-1 rounded border border-red-400 hover:border-red-300"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No students found matching your criteria.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedStudent && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-green-500 mb-4">
              Student Progress
            </h2>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-400">Name:</span> {selectedStudent.name}</p>
              <p><span className="text-gray-400">Email:</span> {selectedStudent.email}</p>
              <p><span className="text-gray-400">Enrolled Courses:</span> {selectedStudent.enrolledCourses}</p>
              <p><span className="text-gray-400">Average Progress:</span> {selectedStudent.progress}%</p>
              <p>
                <span className="text-gray-400">Assignments Submitted:</span>{' '}
                {selectedStudent.assignmentsSubmitted} / {selectedStudent.totalAssignments}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="w-full mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;