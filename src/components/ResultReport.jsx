
import React, { useState } from 'react';

function ResultReport({ responses }) {
    const [report, setReport] = useState('');
    const [isAnalyzed, setIsAnalyzed] = useState(false);
    const [email, setEmail] = useState('');
    const [emailSaved, setEmailSaved] = useState(false);

    const analyzeResponses = () => {
        if (!email) return alert("Please enter an email address before analysis.");
        localStorage.setItem('user_email', email);

        fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responses }),
        })
        .then(res => res.json())
        .then(data => {
            setReport(data.report || 'No analysis available.');
            setIsAnalyzed(true);
        })
        .catch(() => setReport('Failed to generate report.'));
    };

    return (
        <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-800 shadow rounded text-left">
            <h2 className="text-2xl font-semibold mb-4">Psychological Report</h2>

            {!isAnalyzed ? (
                <div className="text-center">
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                        You have completed all responses. Please enter your email before analyzing your answers.
                    </p>
                    <input
                        type="email"
                        className="w-full mb-4 px-3 py-2 border rounded"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        onClick={analyzeResponses}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                    >
                        Analyze Responses
                    </button>
                </div>
            ) : (
                <>
                    <pre className="whitespace-pre-wrap text-sm mb-4">{report}</pre>
                    <button
                        onClick={() => {
                            fetch('/api/report', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ responses, reportText: report, userName: "User" }),
                            })
                            .then(response => response.blob())
                            .then(blob => {
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', 'Rorschach_Report.pdf');
                                document.body.appendChild(link);
                                link.click();
                                link.remove();
                            });
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Download PDF Report
                    </button>
                </>
            )}
        </div>
    );
}

export default ResultReport;
