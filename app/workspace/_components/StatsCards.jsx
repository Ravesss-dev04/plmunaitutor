"use client"
import React from 'react'
import { Book, Clock, Award } from 'lucide-react'

function StatsCards() {
  const stats = [
    {
      title: "Course In Progress",
      value: "3",
      icon: Book,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Course Completed",
      value: "2",
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Upcoming Quizzes",
      value: "4",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    }
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:w-full md:ml-0 w-82 -ml-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-[#13181F] border border-[#232935] p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-100">{stat.title}</h3>
              <p className="text-3xl text-green-500 font-bold mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
