// app/teacher/course/[slug]/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BookOpen, FileText, Megaphone, Users, BarChart2, Trash2, Edit, Lightbulb, X, Plus, Clock, Sparkles } from "lucide-react";

const CoursePage = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("Lesson");
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    video_url: "",
    order_index: 0
  });

  // Quiz states
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    deadline: "",
    topic: "",
    difficulty: "beginner",
    numberOfQuestions: 5
  });
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [slug]);

  const fetchCourseData = async () => {
    try {
      const courseResponse = await fetch(`/api/courses?slug=${slug}`);
      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setCourse(courseData[0]);
        
        const [lessonsRes, quizzesRes, assignmentsRes, announcementsRes, studentsRes] = await Promise.all([
          fetch(`/api/courses/${courseData[0].id}/lessons`),
          fetch(`/api/courses/${courseData[0].id}/quizzes`),
          fetch(`/api/courses/${courseData[0].id}/assignments`),
          fetch(`/api/courses/${courseData[0].id}/announcements`),
          fetch(`/api/courses/${courseData[0].id}/students`)
        ]);

        if (lessonsRes.ok) setLessons(await lessonsRes.json());
        if (quizzesRes.ok) setQuizzes(await quizzesRes.json());
        if (assignmentsRes.ok) setAssignments(await assignmentsRes.json());
        if (announcementsRes.ok) setAnnouncements(await announcementsRes.json());
        if (studentsRes.ok) setStudents(await studentsRes.json());
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lesson Functions
  const handleAddLesson = () => {
    setShowAddLessonModal(true);
  };

  const handleSubmitLesson = async (lessonData) => {
    if (!lessonData.title.trim()) {
      alert("Please enter a lesson title");
      return;
    }

    try {
      const response = await fetch(`/api/courses/${course.id}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...lessonData,
          status: "published"
        })
      });
      
      if (response.ok) {
        const createdLesson = await response.json();
        setLessons(prev => [...prev, createdLesson]);
        
        // Close modal
        setShowAddLessonModal(false);
        
        // Notify students about new lesson
        await notifyStudentsAboutNewLesson(lessonData.title);
        
        alert("Lesson created successfully!");
      }
    } catch (error) {
      console.error('Error adding lesson:', error);
      alert("Error creating lesson. Please try again.");
    }
  };

  const notifyStudentsAboutNewLesson = async (lessonTitle) => {
    try {
      const response = await fetch('/api/student-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: course.id,
          course_title: course.title,
          teacher_name: course.teacher_name || "Teacher",
          lesson_title: lessonTitle,
          type: 'new_lesson'
        })
      });

      if (response.ok) {
        console.log("✅ Students notified about new lesson");
      }
    } catch (error) {
      console.error('Error notifying students:', error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      try {
        const response = await fetch(`/api/courses/${course.id}/lessons/${lessonId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
          alert("Lesson deleted successfully!");
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error deleting lesson:', error);
        alert("Error deleting lesson. Please try again.");
      }
    }
  };

  const handleEditLesson = (lesson) => {
    const newTitle = prompt("Enter new lesson title:", lesson.title);
    if (newTitle && newTitle !== lesson.title) {
      // Implement edit functionality
      console.log("Edit lesson:", lesson.id, newTitle);
    }
  };

  // Quiz Functions
  const handleAddQuiz = () => {
    setShowAddQuizModal(true);
    setGeneratedQuiz(null);
    setQuizData({
      title: "",
      description: "",
      deadline: "",
      topic: course?.title || "",
      difficulty: "beginner",
      numberOfQuestions: 5
    });
  };

  const generateQuizWithAI = async () => {
    if (!quizData.topic.trim()) {
      alert("Please enter a topic for the quiz");
      return;
    }

    try {
      setGeneratingQuiz(true);
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: quizData.topic,
          difficulty: quizData.difficulty,
          numberOfQuestions: quizData.numberOfQuestions
        })
      });

      const data = await response.json();
      
      if (data.quiz) {
        setGeneratedQuiz(data.quiz);
        setQuizData(prev => ({
          ...prev,
          title: data.quiz.quizTitle,
          description: data.quiz.description
        }));
      } else {
        alert("Failed to generate quiz. Please try again.");
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert("Error generating quiz. Please try again.");
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quizData.title.trim() || !generatedQuiz) {
      alert("Please generate a quiz first and ensure all fields are filled");
      return;
    }

    try {
      const response = await fetch(`/api/courses/${course.id}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: quizData.title,
          description: quizData.description,
          questions: generatedQuiz.questions,
          deadline: quizData.deadline
        })
      });
      
      if (response.ok) {
        const createdQuiz = await response.json();
        setQuizzes(prev => [...prev, createdQuiz]);
        setShowAddQuizModal(false);
        
        // Notify students about new quiz
        await notifyStudentsAboutNewQuiz(quizData.title);
        
        alert("Quiz created successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert("Error creating quiz. Please try again.");
    }
  };

 const notifyStudentsAboutNewQuiz = async (quizTitle) => {
  try {
    // Get all students enrolled in this course
    const studentsResponse = await fetch(`/api/courses/${course.id}/students`);
    if (studentsResponse.ok) {
      const students = await studentsResponse.json();
      
      // Create notifications for each student
      await Promise.all(
        students.map(async (student) => {
          const response = await fetch('/api/student-notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              student_id: student.student_id,
              course_id: course.id,
              course_title: course.title,
              teacher_name: course.teacher_name || "Teacher",
              quiz_title: quizTitle,
              type: 'new_quiz',
              deadline: quizData.deadline,
              message: `New quiz available: ${quizTitle}${quizData.deadline ? ` - Due ${new Date(quizData.deadline).toLocaleDateString()}` : ''}`
            })
          });
          
          if (response.ok) {
            console.log(`✅ Notification sent to student ${student.student_name}`);
          }
        })
      );
      
      console.log("✅ All students notified about new quiz");
    }
  } catch (error) {
    console.error('Error notifying students:', error);
  }
};

  const handleDeleteQuiz = async (quizId) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      try {
        const response = await fetch(`/api/courses/${course.id}/quizzes/${quizId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
          alert("Quiz deleted successfully!");
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert("Error deleting quiz. Please try again.");
      }
    }
  };

  // Add Lesson Modal Component
  const AddLessonModal = () => {
    if (!showAddLessonModal) return null;

    return (
      <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#161b22] border border-gray-700 rounded-lg w-full max-w-md">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Add New Lesson</h2>
            <button 
              onClick={() => setShowAddLessonModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Modal Body */}
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitLesson(newLesson); }} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Lesson Title *
              </label>
              <input
                type="text"
                value={newLesson.title}
                onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                className="w-full bg-[#0d1117] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                placeholder="Enter lesson title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Lesson Content
              </label>
              <textarea
                value={newLesson.content}
                onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
                className="w-full bg-[#0d1117] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 min-h-[100px]"
                placeholder="Enter lesson content (optional)"
                rows="4"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video URL
              </label>
              <input
                type="url"
                value={newLesson.video_url}
                onChange={(e) => setNewLesson({...newLesson, video_url: e.target.value})}
                className="w-full bg-[#0d1117] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                placeholder="https://example.com/video (optional)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={newLesson.order_index}
                onChange={(e) => setNewLesson({...newLesson, order_index: parseInt(e.target.value) || 0})}
                className="w-full bg-[#0d1117] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                min="0"
              />
            </div>
          </form>
          
          {/* Modal Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => setShowAddLessonModal(false)}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmitLesson(newLesson)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <BookOpen size={16} />
              Create Lesson
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add Quiz Modal Component
  const AddQuizModal = () => {
    if (!showAddQuizModal) return null;

    return (
      <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#161b22] border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Create New Quiz</h2>
            <button 
              onClick={() => setShowAddQuizModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Quiz Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quiz Topic *
                </label>
                <input
                  type="text"
                  value={quizData.topic}
                  onChange={(e) => setQuizData({...quizData, topic: e.target.value})}
                  className="w-full bg-[#0d1117] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                  placeholder="Enter quiz topic"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={quizData.difficulty}
                  onChange={(e) => setQuizData({...quizData, difficulty: e.target.value})}
                  className="w-full bg-[#0d1117] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Questions
                </label>
                <select
                  value={quizData.numberOfQuestions}
                  onChange={(e) => setQuizData({...quizData, numberOfQuestions: parseInt(e.target.value)})}
                  className="w-full bg-[#0d1117] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                >
                  <option value="3">3 Questions</option>
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="15">15 Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deadline (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={quizData.deadline}
                  onChange={(e) => setQuizData({...quizData, deadline: e.target.value})}
                  className="w-full bg-[#0d1117] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <button
                onClick={generateQuizWithAI}
                disabled={generatingQuiz || !quizData.topic.trim()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  generatingQuiz 
                    ? 'bg-green-700 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {generatingQuiz ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating Quiz...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate Quiz with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Quiz Preview */}
            {generatedQuiz && (
              <div className="border border-green-500 rounded-lg p-4 bg-green-900/20">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Generated Quiz Preview</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      value={quizData.title}
                      onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                      className="w-full bg-[#0d1117] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={quizData.description}
                      onChange={(e) => setQuizData({...quizData, description: e.target.value})}
                      className="w-full bg-[#0d1117] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 min-h-[80px]"
                    />
                  </div>

                  {/* Questions Preview */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Questions:</h4>
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {generatedQuiz.questions.map((q, index) => (
                        <div key={index} className="bg-[#1a1f29] p-4 rounded-lg">
                          <p className="text-white font-medium mb-2">
                            {index + 1}. {q.question}
                          </p>
                          <div className="space-y-1 ml-4">
                            {q.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                                  optIndex === q.correctAnswer 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-600 text-gray-300'
                                }`}>
                                  {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span className={`${
                                  optIndex === q.correctAnswer ? 'text-green-400 font-semibold' : 'text-gray-300'
                                }`}>
                                  {option}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Modal Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => setShowAddQuizModal(false)}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitQuiz}
              disabled={!generatedQuiz}
              className={`bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                !generatedQuiz ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
            >
              <FileText size={16} />
              Create Quiz
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Lesson":
        return (
          <div className="p-4">
            {lessons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-600" />
                <p>No lessons created yet</p>
                <button 
                  onClick={handleAddLesson}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Create Your First Lesson
                </button>
              </div>
            ) : (
              <table className="w-full text-left text-gray-300 text-sm">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-400 uppercase text-xs">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Date Created</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((lesson) => (
                    <tr key={lesson.id} className="border-b border-gray-800 hover:bg-[#1c2128] transition">
                      <td className="py-3 px-4">{lesson.title}</td>
                      <td className="py-3 px-4">{lesson.order_index}</td>
                      <td className="py-3 px-4">{new Date(lesson.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          lesson.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-300'
                        }`}>
                          {lesson.status || 'Published'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleEditLesson(lesson)}
                          className="hover:text-green-500 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      case "Quiz":
        return (
          <div className="p-4">
            {quizzes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-600" />
                <p>No quizzes created yet</p>
                <button 
                  onClick={handleAddQuiz}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 mx-auto"
                >
                  <Plus size={16} />
                  Create Your First Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-[#1a1f29] border border-gray-700 rounded-lg p-4 hover:border-green-500 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{quiz.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{quiz.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FileText size={14} />
                            <span>{quiz.questions?.length || 0} questions</span>
                          </div>
                          
                          {quiz.deadline && (
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>Due: {new Date(quiz.deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1">
                            <span>Created: {new Date(quiz.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                          View Results
                        </button>
                        <button 
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "Assignments":
        return (
          <div className="p-4">
            {assignments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-600" />
                <p>No assignments created yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-[#1a1f29] border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{assignment.title}</h3>
                    <p className="text-gray-400 text-sm">{assignment.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "Announcement":
        return (
          <div className="p-4">
            {announcements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Megaphone size={48} className="mx-auto mb-4 text-gray-600" />
                <p>No announcements created yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="bg-[#1a1f29] border border-gray-700 rounded-lg p-4">
                    <p className="text-gray-300">{announcement.message}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "Students":
        return (
          <div className="p-4">
            {students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users size={48} className="mx-auto mb-4 text-gray-600" />
                <p>No students enrolled yet</p>
              </div>
            ) : (
              <table className="w-full text-left text-gray-300 text-sm">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-400 uppercase text-xs">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Last Accessed</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-gray-800 hover:bg-[#1c2128] transition">
                      <td className="py-3 px-4">{student.student_name}</td>
                      <td className="py-3 px-4">{student.student_email}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-green-500 text-xs">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-400">
                        {student.last_accessed ? new Date(student.last_accessed).toLocaleDateString() : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      case "Analytics":
        return (
          <div className="p-4 text-center py-8 text-gray-500">
            <BarChart2 size={48} className="mx-auto mb-4 text-gray-600" />
            <p>Analytics dashboard coming soon</p>
          </div>
        );

      default:
        return <div className="p-4 text-gray-400">Content for {activeTab}</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-gray-100 p-6">
        <div className="text-red-500">
          <h2 className="text-xl font-bold">Course Not Found</h2>
          <p>The course you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#0d1117] text-gray-100 p-6 flex flex-col lg:flex-row gap-6">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          {/* Course Header */}
          <div className="bg-[#161b22] p-6 rounded-lg border border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-green-500">{course.title}</h1>
                <p className="text-gray-400 mt-2">{students.length} Students • {lessons.length} Lessons • {quizzes.length} Quizzes</p>
              </div>
              <img
                src={course.image_url || "/hand.png"}
                alt="Course"
                className="relative w-full aspect-square h-32 object-cover rounded-lg"
              />
            </div>
            
            {/* Progress */}
            <div className="mt-6">
              <div className="text-sm text-gray-300 mb-2 flex justify-between">
                <span>Course Progress</span>
                <span>65% complete</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button 
                onClick={handleAddLesson}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <BookOpen size={16} /> Add Lesson
              </button>
              <button 
                onClick={handleAddQuiz}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <FileText size={16} /> Add Quiz
              </button>
              <button className="flex items-center gap-2 border border-green-600 text-green-500 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                <Megaphone size={16} /> Add Announcement
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-[#161b22] border border-gray-800 rounded-lg">
            <div className="flex justify-around text-gray-400 text-sm font-medium border-b border-gray-700">
              {["Lesson", "Quiz", "Assignments", "Announcement", "Students", "Analytics"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-4 hover:text-green-500 transition-colors duration-200 ${
                    activeTab === tab ? "text-green-500 border-b-2 border-green-500" : ""
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-96 bg-[#161b22] border border-gray-800 rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Lightbulb size={20} className="text-green-500" />
            <h2 className="text-lg font-semibold">AI Assistant</h2>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-400">Course Insights</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <div className="text-green-500 mt-1">☑</div>
                {students.length} students enrolled in this course
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <div className="text-green-500 mt-1">☑</div>
                {lessons.length} lessons created
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <div className="text-green-500 mt-1">☑</div>
                {quizzes.length} quizzes available
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <div className="text-green-500 mt-1">☑</div>
                Average progress: {Math.round(students.reduce((acc, student) => acc + student.progress, 0) / (students.length || 1))}%
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-400">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={handleAddLesson}
                className="w-full text-left p-3 bg-[#0d1117] hover:bg-[#1a1f29] rounded-lg transition-colors text-sm"
              >
                + Create New Lesson
              </button>
              <button 
                onClick={handleAddQuiz}
                className="w-full text-left p-3 bg-[#0d1117] hover:bg-[#1a1f29] rounded-lg transition-colors text-sm"
              >
                + Create New Quiz
              </button>
              <button className="w-full text-left p-3 bg-[#0d1117] hover:bg-[#1a1f29] rounded-lg transition-colors text-sm">
                + Send Announcement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Lesson Modal */}
      <AddLessonModal />

      {/* Add Quiz Modal */}
      <AddQuizModal />
    </>
  );
};

export default CoursePage;