"use client";

export default function AssignmentTab ({assignments}) {
    return(
        <div className="space-y-4">
            {assignments.map((assignment,index) => (
                <div key={index} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
                    <span>{assignment.title}</span>
                    <span className="text-sm text-green-500">
                        {assignment.submitted ? "Submitted" : "Not Submitted"}
                    </span>
                </div>
            ))}
        </div>  
    )
}