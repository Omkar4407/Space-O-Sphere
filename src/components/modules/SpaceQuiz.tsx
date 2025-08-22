import React, { useState, useEffect } from 'react';
import { quizQuestions } from '../../data/quizQuestions';
import { Brain, Clock, Trophy, RotateCcw, CheckCircle, XCircle, Star } from 'lucide-react';

const SpaceQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Array<{ question: number, selected: number, correct: number }>>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timedMode, setTimedMode] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !quizCompleted && timedMode && timeLeft > 0 && !showExplanation) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showExplanation && quizStarted) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, quizCompleted, showExplanation, timedMode]);

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(-1); // No answer selected
    }
    setShowExplanation(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const question = quizQuestions[currentQuestion];
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setUserAnswers([...userAnswers, {
      question: currentQuestion,
      selected: selectedAnswer || -1,
      correct: question.correctAnswer
    }]);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setTimeLeft(30);
    setQuizCompleted(false);
    setUserAnswers([]);
    setQuizStarted(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    if (timedMode) {
      setTimeLeft(30);
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    if (percentage >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (percentage: number) => {
    if (percentage >= 90) return 'Space Expert!';
    if (percentage >= 80) return 'Astronaut Level';
    if (percentage >= 70) return 'Mission Specialist';
    if (percentage >= 60) return 'Space Cadet';
    if (percentage >= 40) return 'Rookie';
    return 'Need More Training';
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Space Quiz Challenge
            </h1>
            <p className="text-gray-300 mb-6">
              Test your knowledge of astronomy, planets, and space exploration with {quizQuestions.length} challenging questions.
            </p>
            
            <div className="mb-6">
              <label className="flex items-center justify-center space-x-2 text-white mb-4">
                <input
                  type="checkbox"
                  checked={timedMode}
                  onChange={(e) => setTimedMode(e.target.checked)}
                  className="rounded"
                />
                <span>Timed Mode (30 seconds per question)</span>
              </label>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{quizQuestions.length}</div>
                <div className="text-gray-400">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {quizQuestions.filter(q => q.difficulty === 'easy').length}
                </div>
                <div className="text-gray-400">Easy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {quizQuestions.filter(q => q.difficulty === 'hard').length}
                </div>
                <div className="text-gray-400">Hard</div>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4 text-white">Quiz Completed!</h1>
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(percentage)}`}>
              {score}/{quizQuestions.length}
            </div>
            <div className={`text-2xl font-semibold mb-4 ${getScoreColor(percentage)}`}>
              {percentage}% - {getScoreLabel(percentage)}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-500/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{score}</div>
                <div className="text-green-300 text-sm">Correct</div>
              </div>
              <div className="bg-red-500/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{quizQuestions.length - score}</div>
                <div className="text-red-300 text-sm">Wrong</div>
              </div>
              <div className="bg-blue-500/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{percentage}%</div>
                <div className="text-blue-300 text-sm">Score</div>
              </div>
              <div className="bg-purple-500/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {Math.floor(Math.random() * 5) + 1}
                </div>
                <div className="text-purple-300 text-sm">Stars</div>
              </div>
            </div>

            <button
              onClick={restartQuiz}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 mr-4"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Retake Quiz
            </button>
          </div>

          {/* Answer Review */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 className="text-2xl font-bold text-white mb-6">Review Your Answers</h3>
            <div className="space-y-4">
              {userAnswers.map((answer, index) => {
                const question = quizQuestions[answer.question];
                const isCorrect = answer.selected === answer.correct;
                
                return (
                  <div key={index} className={`p-4 rounded-lg border ${
                    isCorrect ? 'bg-green-500/10 border-green-400/30' : 'bg-red-500/10 border-red-400/30'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium flex-1 pr-4">{question.question}</h4>
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <p className="text-gray-300">
                        <span className="text-gray-400">Your answer:</span> {
                          answer.selected === -1 ? 'No answer' : question.options[answer.selected]
                        }
                      </p>
                      {!isCorrect && (
                        <p className="text-green-400">
                          <span className="text-gray-400">Correct answer:</span> {question.options[answer.correct]}
                        </p>
                      )}
                      <p className="text-gray-400 italic text-xs mt-2">{question.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Space Quiz Challenge
          </h1>
          
          <div className="flex justify-center items-center gap-6 text-white">
            <div className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-400" />
              Question {currentQuestion + 1} of {quizQuestions.length}
            </div>
            
            {timedMode && (
              <div className="flex items-center">
                <Clock className={`w-5 h-5 mr-2 ${timeLeft <= 10 ? 'text-red-400' : 'text-green-400'}`} />
                <span className={timeLeft <= 10 ? 'text-red-400 font-bold' : 'text-green-400'}>
                  {timeLeft}s
                </span>
              </div>
            )}
            
            <div className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Score: {score}/{currentQuestion}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
              question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </span>
            
            {timedMode && (
              <div className={`text-2xl font-bold ${
                timeLeft <= 10 ? 'text-red-400' : timeLeft <= 20 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {timeLeft}
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 leading-relaxed">
            {question.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`p-4 text-left rounded-lg border transition-all duration-300 ${
                  showExplanation
                    ? index === question.correctAnswer
                      ? 'bg-green-500/20 border-green-400 text-green-400'
                      : selectedAnswer === index
                      ? 'bg-red-500/20 border-red-400 text-red-400'
                      : 'bg-gray-500/10 border-gray-600 text-gray-400'
                    : selectedAnswer === index
                    ? 'bg-blue-600/20 border-blue-400 text-blue-400 transform scale-105'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:transform hover:scale-102'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full border-2 mr-3 flex items-center justify-center text-sm font-bold ${
                    showExplanation && index === question.correctAnswer
                      ? 'border-green-400 text-green-400'
                      : showExplanation && selectedAnswer === index && index !== question.correctAnswer
                      ? 'border-red-400 text-red-400'
                      : selectedAnswer === index
                      ? 'border-blue-400 text-blue-400'
                      : 'border-gray-400 text-gray-400'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{option}</span>
                  {showExplanation && index === question.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  {showExplanation && selectedAnswer === index && index !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">Explanation:</h4>
              <p className="text-gray-300">{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {!showExplanation && selectedAnswer !== null && (
            <button
              onClick={() => setShowExplanation(true)}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
            >
              Submit Answer
            </button>
          )}

          {showExplanation && (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300"
            >
              {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaceQuiz;