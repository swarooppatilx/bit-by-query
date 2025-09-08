import React, { useState } from 'react';
import HomePage from './HomePage';
import TopicPage from './TopicPage';
import QuestionsListPage from './QuestionsListPage';
import QuestionDetailPage from './QuestionDetailPage';

const SQLPlatform = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleStartContest = () => {
    setCurrentPage('topics');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedTopic(null);
    setSelectedQuestion(null);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setCurrentPage('questions');
  };

  const handleBackToTopics = () => {
    setCurrentPage('topics');
    setSelectedQuestion(null);
  };

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setCurrentPage('question-detail');
  };

  const handleBackToQuestions = () => {
    setCurrentPage('questions');
    setSelectedQuestion(null);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onStartContest={handleStartContest} />;
      case 'topics':
        return <TopicPage onBackToHome={handleBackToHome} onTopicSelect={handleTopicSelect} />;
      case 'questions':
        return (
          <QuestionsListPage 
            selectedTopic={selectedTopic}
            onBackToTopics={handleBackToTopics}
            onQuestionSelect={handleQuestionSelect}
          />
        );
      case 'question-detail':
        return (
          <QuestionDetailPage 
            selectedQuestion={selectedQuestion}
            onBackToQuestions={handleBackToQuestions}
          />
        );
      default:
        return <HomePage onStartContest={handleStartContest} />;
    }
  };

  return renderCurrentPage();
};

export default SQLPlatform;