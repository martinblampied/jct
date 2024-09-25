"use client"

import { useState, useEffect } from 'react'
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group"
import { Label } from "./components/ui/label"
import confetti from 'canvas-confetti'

import quizData from '../../questions.json'

// Define the structure of a quiz question
interface QuizQuestion {
  question: string
  options: string[]
  answer: string
}


export default function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    // Shuffle the questions when the component mounts
    const shuffledQuestions = [...quizData].sort(() => Math.random() - 0.5)
    setQuestions(shuffledQuestions)
  }, [])

  useEffect(() => {
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [isCorrect])

  const handleAnswerSubmit = () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions.length) {
      const correct = selectedAnswer === questions[currentQuestion].answer
      setIsCorrect(correct)
      setAnswerSubmitted(true)
      if (correct) {
        setScore(score + 1)
      }
    } else {
      setShowResult(true)
    }
  }

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion)
      setSelectedAnswer("")
      setAnswerSubmitted(false)
      setIsCorrect(false)
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer("")
    setScore(0)
    setShowResult(false)
    setAnswerSubmitted(false)
    setIsCorrect(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-white mx-auto">
        <CardHeader className="bg-red-600 text-white">
          <CardTitle className="text-2xl font-bold text-center">Jersey Citizenship Test</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
        {!showResult ? (
          <>
            <div className="mb-4 text-center">
              <p className="text-lg font-semibold">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <p className="text-sm text-gray-600">
                Correct: {score} | Answered: {currentQuestion} | Total: {questions.length}
              </p>
            </div>
            <h2 className="text-xl font-bold mb-4">{questions[currentQuestion]?.question}</h2>
            <RadioGroup  
                value={selectedAnswer} 
                onValueChange={setSelectedAnswer} 
                className="space-y-2"
                disabled={answerSubmitted}
              >
                {questions[currentQuestion]?.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className={
                      answerSubmitted
                        ? option === quizData[currentQuestion].answer
                          ? "text-green-600 font-bold"
                          : selectedAnswer === option
                            ? "text-red-600 line-through"
                            : ""
                        : ""
                    }>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {!answerSubmitted ? (
                <Button 
                  onClick={handleAnswerSubmit} 
                  className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white"
                  disabled={!selectedAnswer}
                >
                  Submit Answer
                </Button>
              ) : (
                <>
                  <p className={`mt-4 text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect. The correct answer is shown above.'}
                  </p>
                  <Button 
                    onClick={handleNextQuestion} 
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {currentQuestion === quizData.length - 1 ? "Finish Quiz" : "Next Question"}
                  </Button>
                </>
              )}
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
              <p className="text-lg mb-4">Your score: {score} out of {quizData.length}</p>
              <Button onClick={resetQuiz} className="bg-red-600 hover:bg-red-700 text-white">
                Restart Quiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}