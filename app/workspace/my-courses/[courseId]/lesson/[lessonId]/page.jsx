"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, BookOpen, Video, FileText, Eye, ChevronRight } from "lucide-react";
import Link from "next/link";

// Practice Exercise Modal Component
const PracticeExerciseModal = ({ exercise, isOpen, onClose, onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete(exercise.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-[#161b22] border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700 flex-shrink-0">
          <div className="min-w-0 flex-1 pr-2">
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">{exercise.title}</h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Practice Exercise</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0 p-1"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] flex-1">
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed space-y-4">
              {exercise.content}
              
              {exercise.questions && exercise.questions.map((question, index) => (
                <div key={index} className="bg-[#1a1f29] p-4 rounded-lg mt-4">
                  <h4 className="font-semibold text-white mb-3">
                    Question {index + 1}: {question.question}
                  </h4>
                  <div className="space-y-2">
                    {question.options && question.options.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          className="text-green-500 focus:ring-green-500"
                        />
                        <span className="text-gray-300">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm sm:text-base order-2 sm:order-1"
          >
            Close
          </button>
          {!isCompleted ? (
            <button
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2"
            >
              <CheckCircle size={16} className="sm:w-4 sm:h-4" />
              Mark as Done
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-500 text-sm sm:text-base order-1 sm:order-2">
              <CheckCircle size={16} className="sm:w-4 sm:h-4" />
              Completed!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [completedExercises, setCompletedExercises] = useState(new Set());

  // Sample React practice exercises
  const practiceExercises = [
    {
      id: 1,
      title: "Understanding React Components",
      content: `
        <h3>What are React Components?</h3>
        <p>React components are the building blocks of React applications. They let you split the UI into independent, reusable pieces that can be managed independently.</p>
        
        <h4>Key Concepts:</h4>
        <ul>
          <li><strong>Functional Components:</strong> Simple JavaScript functions that return JSX</li>
          <li><strong>Class Components:</strong> ES6 classes that extend React.Component</li>
          <li><strong>JSX:</strong> Syntax extension that looks like HTML but is JavaScript</li>
          <li><strong>Props:</strong> Inputs to components (like function parameters)</li>
          <li><strong>State:</strong> Data that changes over time within a component</li>
        </ul>
        
        <div class="bg-blue-900 border-l-4 border-blue-500 p-4 my-4">
          <strong>Example:</strong>
          <pre class="bg-black p-3 rounded mt-2 overflow-x-auto">
function Welcome(props) {
  return &lt;h1&gt;Hello, {props.name}!&lt;/h1&gt;;
}</pre>
        </div>
      `,
      questions: [
        {
          question: "Which syntax is used to write React components?",
          options: ["HTML", "JSX", "CSS", "Python"]
        },
        {
          question: "What are props in React?",
          options: [
            "Functions that return JSX",
            "Inputs passed to components",
            "CSS styles",
            "External libraries"
          ]
        }
      ]
    },
    {
      id: 2,
      title: "React State and Events",
      content: `
        <h3>Managing State in React</h3>
        <p>State allows React components to change their output over time in response to user actions, network responses, and anything else.</p>
        
        <h4>useState Hook:</h4>
        <p>The useState hook lets you add state to functional components.</p>
        
        <div class="bg-blue-900 border-l-4 border-blue-500 p-4 my-4">
          <strong>Example:</strong>
          <pre class="bg-black p-3 rounded mt-2 overflow-x-auto">
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    &lt;div&gt;
      &lt;p&gt;You clicked {count} times&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;
        Click me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</pre>
        </div>
        
        <h4>Event Handling:</h4>
        <p>React events are named using camelCase (onClick, onChange) rather than lowercase.</p>
      `,
      questions: [
        {
          question: "Which hook is used to manage state in functional components?",
          options: ["useEffect", "useState", "useContext", "useReducer"]
        },
        {
          question: "How do you update state in React?",
          options: [
            "Directly modifying the state variable",
            "Using the setter function provided by useState",
            "Using this.setState()",
            "Reassigning the state variable"
          ]
        }
      ]
    },
    {
      id: 3,
      title: "React Props and Data Flow",
      content: `
        <h3>Passing Data with Props</h3>
        <p>Props (properties) are how you pass data from parent to child components. They are read-only and help create reusable components.</p>
        
        <div class="bg-blue-900 border-l-4 border-blue-500 p-4 my-4">
          <strong>Example:</strong>
          <pre class="bg-black p-3 rounded mt-2 overflow-x-auto">
function UserProfile(props) {
  return (
    &lt;div&gt;
      &lt;h2&gt;{props.name}&lt;/h2&gt;
      &lt;p&gt;Age: {props.age}&lt;/p&gt;
      &lt;p&gt;Email: {props.email}&lt;/p&gt;
    &lt;/div&gt;
  );
}

// Usage:
&lt;UserProfile name="John" age={25} email="john@example.com" /&gt;</pre>
        </div>
        
        <h4>Key Points:</h4>
        <ul>
          <li>Props are immutable (cannot be changed by child components)</li>
          <li>Use destructuring for cleaner code</li>
          <li>Props can be functions, objects, arrays, or any JavaScript value</li>
        </ul>
      `,
      questions: [
        {
          question: "Can child components modify props received from parents?",
          options: ["Yes, always", "No, props are read-only", "Only if using state", "Only in class components"]
        },
        {
          question: "What is the purpose of props in React?",
          options: [
            "To manage component state",
            "To pass data from parent to child components",
            "To handle user events",
            "To style components"
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    fetchLessonData();
  }, [courseId, lessonId]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseResponse = await fetch(`/api/courses/${courseId}`);
      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setCourse(courseData);
      }

      // Fetch lesson details
      const lessonResponse = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`);
      if (lessonResponse.ok) {
        const lessonData = await lessonResponse.json();
        setLesson(lessonData);
        
        // Check if lesson is already completed
        await checkLessonCompletion();
      } else {
        console.error("Lesson not found");
      }
    } catch (error) {
      console.error('Error fetching lesson data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkLessonCompletion = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/progress`);
      if (response.ok) {
        const progressData = await response.json();
        const completed = progressData.completedLessons?.includes(parseInt(lessonId));
        setIsCompleted(completed);
      }
    } catch (error) {
      console.error('Error checking lesson completion:', error);
    }
  };

  const markLessonAsViewed = async () => {
    try {
      setMarkingComplete(true);
      
      const response = await fetch('/api/student-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: parseInt(courseId),
          lesson_id: parseInt(lessonId),
          completed: true
        })
      });

      if (response.ok) {
        console.log("✅ Lesson marked as completed");
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleMarkComplete = async () => {
    await markLessonAsViewed();
    alert("Lesson marked as completed!");
  };

  const handleNextLesson = () => {
    router.push(`/workspace/my-courses/${courseId}?tab=lessons`);
  };

  const openExercise = (exercise) => {
    setSelectedExercise(exercise);
  };

  const closeExercise = () => {
    setSelectedExercise(null);
  };

  const completeExercise = (exerciseId) => {
    setCompletedExercises(prev => new Set(prev).add(exerciseId));
    setTimeout(() => {
      setSelectedExercise(null);
    }, 1500);
  };

  const allExercisesCompleted = practiceExercises.length > 0 && 
    practiceExercises.every(exercise => completedExercises.has(exercise.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white p-6">
        <div className="text-red-500">
          <h2 className="text-xl font-bold">Lesson Not Found</h2>
          <p>The lesson you're looking for doesn't exist.</p>
          <Link 
            href={`/workspace/my-courses/${courseId}?tab=lessons`}
            className="text-green-500 hover:underline mt-4 inline-block"
          >
            ← Back to Lessons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 sm:p-6 border-b border-green-700">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <Link 
                href={`/workspace/my-courses/${courseId}?tab=lessons`}
                className="hover:bg-green-700 p-2 rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold truncate">{lesson.title}</h1>
                <p className="text-green-100 text-sm sm:text-base truncate">
                  {course?.title} • By {course?.teacher_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {isCompleted ? (
                <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base">
                  <CheckCircle size={18} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Completed</span>
                </div>
              ) : markingComplete ? (
                <div className="flex items-center gap-2 text-green-200 text-sm sm:text-base">
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <button
                  onClick={handleMarkComplete}
                  className="flex items-center gap-2 bg-white text-green-600 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  <CheckCircle size={18} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Mark as Complete</span>
                  <span className="sm:hidden">Complete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-[#161b22] rounded-lg border border-gray-700 p-4 sm:p-6">
              {/* Lesson Type Icon */}
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                {lesson.video_url ? (
                  <Video className="text-red-500 w-6 h-6 sm:w-8 sm:h-8" />
                ) : (
                  <BookOpen className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8" />
                )}
                <span className="text-gray-400 uppercase text-xs sm:text-sm font-semibold">
                  {lesson.video_url ? 'Video Lesson' : 'Text Lesson'}
                </span>
              </div>

              {/* Video Player (if video URL exists) */}
              {lesson.video_url && (
                <div className="mb-6">
                  <div className="aspect-video bg-black rounded-lg mb-4">
                    <video 
                      controls 
                      className="w-full h-full rounded-lg"
                      poster="/video-thumbnail.jpg"
                    >
                      <source src={lesson.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}

              {/* Lesson Content */}
              <div className="prose prose-invert max-w-none mb-8">
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {lesson.content || (
                    <div className="text-center py-12 text-gray-500">
                      <FileText size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No content available for this lesson yet.</p>
                      <p className="text-sm mt-2">Check back later for updates.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Practice Exercises Section */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start flex-wrap gap-3 sm:gap-4 mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Practice Exercises</h3>
                  {allExercisesCompleted && (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle size={18} className="sm:w-5 sm:h-5" />
                      <span className="font-semibold text-sm sm:text-base">All exercises completed!</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-[#1a1f29] rounded-lg p-4 sm:p-6">
                  <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                    Complete the following exercises to practice what you've learned about React:
                  </p>
                  
                  <div className="space-y-4">
                    {practiceExercises.map((exercise, index) => (
                      <div 
                        key={exercise.id}
                        className="bg-[#0d1117] rounded-lg p-4 sm:p-5 border border-gray-700 hover:border-green-500 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              completedExercises.has(exercise.id) 
                                ? 'bg-green-500' 
                                : 'bg-gray-600'
                            }`}>
                              {completedExercises.has(exercise.id) ? (
                                <CheckCircle size={16} className="text-white sm:w-5 sm:h-5" />
                              ) : (
                                <span className="text-white text-sm sm:text-base font-bold">{index + 1}</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-white text-sm sm:text-base break-words">{exercise.title}</h4>
                              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                {completedExercises.has(exercise.id) 
                                  ? 'Completed' 
                                  : 'Click to start practice'
                                }
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => openExercise(exercise)}
                            className={`flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors w-full sm:w-auto flex-shrink-0 ${
                              completedExercises.has(exercise.id)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                            }`}
                          >
                            {completedExercises.has(exercise.id) ? (
                              <>
                                <CheckCircle size={16} className="sm:w-4 sm:h-4" />
                                <span className="text-sm sm:text-base">Completed</span>
                              </>
                            ) : (
                              <>
                                <Eye size={16} className="sm:w-4 sm:h-4" />
                                <span className="text-sm sm:text-base">View</span>
                                <ChevronRight size={16} className="sm:w-4 sm:h-4 hidden sm:block" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Progress Card */}
            <div className="bg-[#161b22] rounded-lg border border-gray-700 p-4 sm:p-6">
              <h3 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Lesson Progress</h3>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${isCompleted ? 'bg-green-500' : 'bg-gray-600'} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {isCompleted ? (
                    <CheckCircle size={20} className="text-white sm:w-6 sm:h-6" />
                  ) : (
                    <BookOpen size={20} className="text-gray-400 sm:w-6 sm:h-6" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm sm:text-base">
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {isCompleted ? 'You\'ve completed this lesson' : 'Continue learning'}
                  </p>
                </div>
              </div>
            </div>

            {/* Exercises Progress */}
            <div className="bg-[#161b22] rounded-lg border border-gray-700 p-4 sm:p-6">
              <h3 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Exercises Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-400">Completed</span>
                  <span className="text-white">
                    {completedExercises.size}/{practiceExercises.length}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(completedExercises.size / practiceExercises.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Navigation Card */}
            <div className="bg-[#161b22] rounded-lg border border-gray-700 p-4 sm:p-6">
              <h3 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Course Navigation</h3>
              <div className="space-y-2 sm:space-y-3">
                <Link
                  href={`/workspace/my-courses/${courseId}?tab=lessons`}
                  className="block w-full text-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Back to Lessons
                </Link>
                <button
                  onClick={handleNextLesson}
                  className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Next Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Exercise Modal */}
      {selectedExercise && (
        <PracticeExerciseModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={closeExercise}
          onComplete={completeExercise}
        />
      )}
    </div>
  );
}



