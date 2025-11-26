"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default function AnalyticsOverview() {
  const barData = [
    { name: "Basic Geometry", Completed: 75, "In Progress": 25 },
    { name: "Advanced Probability", Completed: 60, "In Progress": 40 },
  ];

  const pieData = [
    { name: "Grade A", value: 28 },
    { name: "Grade B", value: 41 },
    { name: "Grade C", value: 21 },
    { name: "Grade D", value: 7 },
    { name: "Grade F", value: 3 },
  ];

  const COLORS = ["#22c55e", "#16a34a", "#4ade80", "#86efac", "#bbf7d0"];

  const lineData = [
    { name: "Mon", mins: 90 },
    { name: "Tue", mins: 110 },
    { name: "Wed", mins: 100 },
    { name: "Thu", mins: 140 },
    { name: "Fri", mins: 120 },
    { name: "Sat", mins: 180 },
    { name: "Sun", mins: 160 },
  ];

  return (
    <div className="p-6 w-full min-h-screen bg-[#0d1117] text-gray-200">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics Overview</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Gain in-depth insights into student performance and course engagement.
          Monitor key metrics to understand learning patterns and identify areas
          for improvement across all your courses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {/* Lesson Completion Rate */}
        <div className="bg-[#161b22] shadow-md rounded-2xl p-5 hover:shadow-lg hover:shadow-green-500/10 transition">
          <h2 className="font-semibold text-gray-100 mb-2">
            Lesson Completion Rate
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Percentage of students completing lessons across different courses.
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="name" stroke="#8b949e" />
              <YAxis stroke="#8b949e" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#161b22",
                  border: "1px solid #30363d",
                  color: "#fff",
                }}
              />
              <Bar dataKey="Completed" fill="#22c55e" radius={[6, 6, 0, 0]} />
              <Bar dataKey="In Progress" fill="#4ade80" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quiz Scores Distribution */}
        <div className="bg-[#161b22] shadow-md rounded-2xl p-5 hover:shadow-lg hover:shadow-green-500/10 transition">
          <h2 className="font-semibold text-gray-100 mb-2">
            Quiz Scores Distribution
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Breakdown of student grades across all quizzes.
          </p>

          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{
                    backgroundColor: "#161b22",
                    border: "1px solid #30363d",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Student Study Time */}
        <div className="bg-[#161b22] shadow-md rounded-2xl p-5 hover:shadow-lg hover:shadow-green-500/10 transition">
          <h2 className="font-semibold text-gray-100 mb-2">
            Daily Student Study Time
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Average minutes students spend studying per day.
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="name" stroke="#8b949e" />
              <YAxis stroke="#8b949e" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#161b22",
                  border: "1px solid #30363d",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="mins"
                stroke="#22c55e"
                strokeWidth={3}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-[#161b22] shadow-md rounded-2xl p-5 flex flex-col justify-center items-center text-center hover:shadow-lg hover:shadow-green-500/10 transition">
          <h2 className="font-semibold text-gray-100 mb-2">
            Engagement Metrics
          </h2>
          <p className="text-sm text-gray-400 mb-2">
            Detailed student interaction and activity over time.
          </p>
          <p className="text-gray-500 text-sm mt-8">
            More detailed engagement metrics coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}
