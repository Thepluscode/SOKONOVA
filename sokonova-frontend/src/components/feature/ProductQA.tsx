
import { useState } from 'react';

interface Question {
  id: string;
  question: string;
  answer: string;
  askedBy: string;
  answeredBy: string;
  date: string;
  helpful: number;
}

export default function ProductQA() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: 'Is this product available in other colors?',
      answer: 'Yes! This product is available in 5 different colors. You can select your preferred color from the options above.',
      askedBy: 'Sarah M.',
      answeredBy: 'SOKONOVA Team',
      date: '2024-01-15',
      helpful: 12,
    },
    {
      id: '2',
      question: 'What is the return policy for this item?',
      answer: 'We offer a 30-day return policy. Items must be unused and in original packaging. Free return shipping is included.',
      askedBy: 'John D.',
      answeredBy: 'SOKONOVA Team',
      date: '2024-01-14',
      helpful: 8,
    },
    {
      id: '3',
      question: 'How long does shipping usually take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping (1-2 days) is also available at checkout.',
      askedBy: 'Emily R.',
      answeredBy: 'SOKONOVA Team',
      date: '2024-01-13',
      helpful: 15,
    },
  ]);

  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAskQuestion = () => {
    if (!newQuestion.trim()) return;

    const question: Question = {
      id: Date.now().toString(),
      question: newQuestion,
      answer: 'Your question has been submitted and will be answered soon by our team.',
      askedBy: 'You',
      answeredBy: 'Pending',
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
    };

    setQuestions([question, ...questions]);
    setNewQuestion('');
    setIsAskModalOpen(false);
  };

  const handleHelpful = (id: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, helpful: q.helpful + 1 } : q
      )
    );
  };

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Questions & Answers</h2>
        <button
          onClick={() => setIsAskModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-question-line mr-2"></i>
          Ask a Question
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-question-line text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-600 mb-4">No questions found</p>
            <button
              onClick={() => setIsAskModalOpen(true)}
              className="text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer whitespace-nowrap"
            >
              Be the first to ask a question
            </button>
          </div>
        ) : (
          filteredQuestions.map((qa) => (
            <div key={qa.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-question-line text-emerald-600"></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">{qa.question}</p>
                  <p className="text-xs text-gray-500">
                    Asked by {qa.askedBy} on {new Date(qa.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {qa.answeredBy !== 'Pending' && (
                <div className="flex items-start gap-3 ml-11 mb-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-chat-3-line text-gray-600"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-1">{qa.answer}</p>
                    <p className="text-xs text-gray-500">
                      Answered by {qa.answeredBy}
                    </p>
                  </div>
                </div>
              )}

              <div className="ml-11 flex items-center gap-4">
                <button
                  onClick={() => handleHelpful(qa.id)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-thumb-up-line"></i>
                  <span>Helpful ({qa.helpful})</span>
                </button>
                <button className="text-sm text-gray-600 hover:text-emerald-600 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-flag-line mr-1"></i>
                  Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isAskModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Ask a Question</h3>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer whitespace-nowrap"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Question
              </label>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="What would you like to know about this product?"
                rows={4}
                maxLength={500}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                {newQuestion.length}/500 characters
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg mb-4">
              <p className="text-sm text-gray-700">
                <i className="ri-information-line text-emerald-600 mr-2"></i>
                Your question will be answered by our team or community members within 24 hours.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleAskQuestion}
                disabled={!newQuestion.trim()}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Submit Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
