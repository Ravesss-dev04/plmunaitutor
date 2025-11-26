"use client";
import { useParams } from "next/navigation";
import LessonMaterialsTable from "../components/LessonMaterials";

export default function LessonMaterialsPage() {
  const { courseId } = useParams();

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-500 mb-4">
        Lesson & Materials 
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        Manage your course materials, upload new lessons, and edit or delete existing content.
      </p>

      <LessonMaterialsTable courseId={courseId} />
    </div>
  );
}
