import React from 'react';
import { Play } from 'lucide-react';

const DifficultyBadge = ({ difficulty }) => (
  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
    difficulty === 'Easy' ? 'bg-green-600 text-green-100' :
    difficulty === 'Medium' ? 'bg-yellow-600 text-yellow-100' :
    'bg-red-600 text-red-100'
  }`}>
    {difficulty}
  </div>
);

const QuestionsListPage = (props) => {
  const { selectedTopic, questions, onBackToTopics, onQuestionSelect, BackButton } = props;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <BackButton onClick={onBackToTopics} text="Back to Topics" />
          <h1 className="text-2xl font-bold text-blue-400">{selectedTopic?.title}</h1>
          <DifficultyBadge difficulty={selectedTopic?.difficulty} />
        </div>

        <p className="text-gray-300 mb-6">{selectedTopic?.description}</p>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-300">{question.title}</h3>
                    <p className="text-gray-400 text-sm">{question.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DifficultyBadge difficulty={question.difficulty} />
                  <button 
                    onClick={() => onQuestionSelect(question)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
                  >
                    <Play size={16} />
                    <span>Solve</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsListPage;