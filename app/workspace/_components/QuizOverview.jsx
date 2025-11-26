"use client"
import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Smartphone, Monitor } from 'lucide-react';

function QuizOverview() {
  const [performanceData, setPerformanceData] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and on resize
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Use test data first
    const testData = {
      weeklyData: [
        {
          week: '2024-01-01',
          weekLabel: 'Week 1',
          subjects: {
            'Web Development': { average: 75 },
            'Python Programming': { average: 82 },
            'Data Science': { average: 68 }
          }
        },
        {
          week: '2024-01-08',
          weekLabel: 'Week 2',
          subjects: {
            'Web Development': { average: 80 },
            'Python Programming': { average: 78 },
            'Data Science': { average: 72 }
          }
        },
        {
          week: '2024-01-15',
          weekLabel: 'Week 3',
          subjects: {
            'Web Development': { average: 85 },
            'Python Programming': { average: 88 },
            'Data Science': { average: 65 }
          }
        },
        {
          week: '2024-01-22',
          weekLabel: 'Week 4',
          subjects: {
            'Web Development': { average: 90 },
            'Python Programming': { average: 85 },
            'Data Science': { average: 78 }
          }
        },
        {
          week: '2024-01-29',
          weekLabel: 'Week 5',
          subjects: {
            'Web Development': { average: 88 },
            'Python Programming': { average: 92 },
            'Data Science': { average: 82 }
          }
        },
        {
          week: '2024-02-05',
          weekLabel: 'Week 6',
          subjects: {
            'Web Development': { average: 92 },
            'Python Programming': { average: 90 },
            'Data Science': { average: 85 }
          }
        }
      ],
      subjects: ['Web Development', 'Python Programming', 'Data Science'],
      totalWeeks: 6
    };

    setPerformanceData(testData);
    setSelectedWeek(testData.weeklyData[5]); // Select latest week
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!performanceData) {
    return (
      <div className="p-4 sm:p-6 rounded-xl shadow-sm bg-[#13181F] border border-[#232935] w-full">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-32 sm:h-48 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const { weeklyData, subjects, totalWeeks } = performanceData;
  const maxScore = 100;

  // Responsive settings
  const barWidth = isMobile ? 'w-2' : 'w-3';
  const barGap = isMobile ? 'gap-0.5' : 'gap-1';
  const graphHeight = isMobile ? 'h-36' : 'h-44';
  const weekLabelSize = isMobile ? 'text-[10px]' : 'text-xs';
  const legendGap = isMobile ? 'gap-2' : 'gap-3';

  return (
    <div className="p-4 sm:p-6 rounded-xl shadow-sm bg-[#13181F] border border-[#232935] w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
            <BarChart3 size={20} />
            Weekly Performance
          </h3>
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
            
           
          </div>
        </div>
        <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* Graph Container */}
      <div className="mb-4 sm:mb-6">
        {/* Y-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 mb-2 px-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>

        {/* Graph with vertical bars */}
        <div className={`relative flex items-end justify-between ${graphHeight} border-b border-l border-gray-700 pb-3 pl-6 sm:pl-8`}>
          {weeklyData.map((week, weekIndex) => (
            <div 
              key={week.week} 
              className="flex flex-col items-center flex-1 h-full min-w-0"
            >
              {/* Bars container */}
              <div className={`flex items-end justify-center ${barGap} h-32 sm:h-36 w-full px-0.5 sm:px-1`}>
                {subjects.map((subject, subjectIndex) => {
                  const score = week.subjects[subject]?.average || 0;
                  const barHeight = (score / maxScore) * (isMobile ? 80 : 85);
                  
                  return (
                    <div
                      key={`${week.week}-${subject}`}
                      className="flex flex-col items-center group relative"
                      style={{ height: `${barHeight}%` }}
                    >
                      {/* Bar */}
                      <div
                        className={`${barWidth} rounded-t transition-all duration-300 ${getScoreColor(score)} hover:opacity-80 cursor-pointer flex-shrink-0`}
                        style={{ height: '100%', minHeight: '4px' }}
                        onClick={() => setSelectedWeek(week)}
                      />
                      
                      {/* Score Tooltip */}
                      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded border border-gray-600 whitespace-nowrap z-10 pointer-events-none">
                        {subject}: {score}%
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Week Label */}
              <div className={`${weekLabelSize} text-gray-400 mt-2 text-center truncate w-full px-1`}>
                {week.weekLabel}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Legend - Responsive */}
      <div className={`flex flex-wrap ${legendGap} justify-center mb-4`}>
        {subjects.map((subject, index) => {
          const subjectScores = weeklyData.flatMap(week => 
            week.subjects[subject] ? [week.subjects[subject].average] : []
          );
          const overallAverage = subjectScores.length > 0 
            ? Math.round(subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length)
            : 0;

          return (
            <div key={subject} className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded ${getScoreColor(overallAverage)} flex-shrink-0`}></div>
              <span className="text-gray-300 truncate max-w-[80px] sm:max-w-[100px]">{subject}</span>
              <span className={`${getScoreTextColor(overallAverage)} flex-shrink-0`}>
                {overallAverage}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected Week Details */}
      {selectedWeek && (
        <div className="mt-4 p-3 sm:p-4 bg-[#1a202c] rounded-lg border border-gray-700">
          <h4 className="font-semibold text-gray-100 mb-3 text-sm">
            {selectedWeek.weekLabel} - Performance
          </h4>
          
          <div className="grid grid-cols-1 gap-2 sm:gap-3 text-sm">
            {subjects.map(subject => {
              const subjectData = selectedWeek.subjects[subject];
              const score = subjectData?.average || 0;
              
              return (
                <div key={subject} className="flex items-center justify-between">
                  <span className="text-gray-300 truncate flex-1 mr-2 text-xs sm:text-sm">
                    {subject}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 sm:w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getScoreColor(score)}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className={`font-medium w-8 sm:w-10 text-right text-xs sm:text-sm ${getScoreTextColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span className="truncate">
            {totalWeeks} weeks • {subjects.length} subjects
          </span>
          <span className="text-[10px] sm:text-xs">
            {isMobile ? 'Tap bars for details' : 'Click bars for details'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default QuizOverview;