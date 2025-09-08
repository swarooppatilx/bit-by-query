import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import QuestionDetailPage from './QuestionDetailPage';
import QuestionsListPage from './QuestionsListPage';
import TopicPage from './TopicPage';

const HomePage = () => {
  const [agreed, setAgreed] = useState(false);
  const [showContest, setShowContest] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const topics = [
    { id: 1, name: "SQL Basics" },
    { id: 2, name: "Joins" },
    // ...add your topics here
  ];

  // Step 1: Rules and Start Contest    
  if (!showContest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-3xl font-bold text-blue-400">Bit by Query - SQL Competition Platform</h1>
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors">
              Start Registration
            </button>
          </div>
          {/* Welcome */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-blue-300 mb-6">Welcome to Bit by Query</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              A full-stack SQL competition platform where participants can test their SQL knowledge, compete
              with peers, and rise up the leaderboard.
            </p>
          </div>
          {/* Rules */}
          <div className="bg-gray-800 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-blue-300 mb-6">Competition Rules & Highlights</h3>
            <ul className="space-y-4">
              <li>Each user must register before joining the contest.</li>
              <li>Contest includes SQL query challenges of varying difficulty.</li>
              <li>Leaderboard is updated in real-time based on scores.</li>
              <li>Ensure to read all instructions before starting.</li>
              <li>Any malpractice leads to disqualification.</li>
              <li>Contest duration: <span className="text-blue-400 font-semibold">2 hours</span></li>
            </ul>
            <div className="mt-8 flex items-center space-x-3">
              <input 
                type="checkbox" 
                id="agree" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5"
              />
              <label htmlFor="agree" className="text-gray-300">
                I have read and agree to all the rules & instructions
              </label>
            </div>
            <button 
              onClick={() => setShowContest(true)}
              disabled={!agreed}
              className={`w-full mt-6 py-3 rounded-lg font-semibold transition-colors ${
                agreed 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Start Contest
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Topic selection
  if (!selectedTopic) {
    return (
      <TopicPage topics={topics} onSelectTopic={setSelectedTopic} />
    );
  }

  // Step 3: Question list for selected topic
  if (!selectedQuestion) {
    return (
      <QuestionsListPage
        topic={selectedTopic}
        onSelectQuestion={setSelectedQuestion}
        onBack={() => setSelectedTopic(null)}
      />
    );
  }

  // Step 4: Question details
  return (
    <QuestionDetailPage
      questionId={selectedQuestion}
      onBack={() => setSelectedQuestion(null)}
    />
  );
};

export default HomePage;