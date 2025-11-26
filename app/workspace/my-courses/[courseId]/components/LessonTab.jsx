"use client";
import React from "react";
import { BookOpen, FileText, Video, CheckCircle, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function LessonTab ({ lessons, courseId, studentProgress }) {
    
    const isLessonCompleted = (lessonId) => {
        return studentProgress.completedLessons?.includes(lessonId) || false;
    };

    return (
        <div className="space-y-4">
            {lessons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <BookOpen size={48} className="mx-auto mb-4 text-gray-600" />
                    <p>No lessons available yet</p>
                    <p className="text-sm mt-2">Check back later for new content</p>
                </div>
            ) : (
                lessons.map((lesson, index) => (
                    <Link
                        key={lesson.id}
                        href={`/workspace/my-courses/${courseId}/lesson/${lesson.id}`}
                        className="block"
                    >
                        <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors duration-200 cursor-pointer group">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    {lesson.video_url ? (
                                        <Video className="text-red-500 w-5 h-5 shrink-0" />
                                    ) : (
                                        <FileText className="text-blue-500 w-5 h-5 shrink-0" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white group-hover:text-green-400 truncate">
                                                Lesson {index + 1}: {lesson.title}
                                            </span>
                                        </div>
                                        {lesson.content && (
                                            <p className="text-sm text-gray-400 mt-1 truncate">
                                                {lesson.content.substring(0, 100)}...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                {isLessonCompleted(lesson.id) ? (
                                    <>
                                        <CheckCircle className="text-green-500 w-5 h-5" />
                                        <span className="text-green-500 text-sm hidden sm:block">Completed</span>
                                    </>
                                ) : (
                                    <>
                                        <PlayCircle className="text-gray-400 w-5 h-5 group-hover:text-green-400" />
                                        <span className="text-gray-400 text-sm hidden sm:block group-hover:text-green-400">Start</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
    )
}