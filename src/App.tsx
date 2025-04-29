
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from './components/ui/button'
import { Progress } from './components/ui/progress'
import './App.css'

interface Question {
  id: number
  text: string
  type: 'text' | 'choice'
  choices?: string[]
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    text: "What's your name?",
    type: 'text'
  },
  {
    id: 2,
    text: 'How did you hear about us?',
    type: 'choice',
    choices: ['Social Media', 'Friend', 'Search Engine', 'Other']
  },
  {
    id: 3,
    text: 'What brings you here today?',
    type: 'text'
  }
]

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [textInput, setTextInput] = useState('')

  const currentQuestion = sampleQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex) / sampleQuestions.length) * 100

  const handleNext = () => {
    if (textInput.trim()) {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: textInput }))
      setTextInput('')
      setCurrentQuestionIndex(prev => Math.min(prev + 1, sampleQuestions.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))
    const previousAnswer = answers[sampleQuestions[currentQuestionIndex - 1]?.id]
    if (previousAnswer) {
      setTextInput(previousAnswer)
    }
  }

  const handleChoice = (choice: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: choice }))
    setCurrentQuestionIndex(prev => Math.min(prev + 1, sampleQuestions.length - 1))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="fixed top-0 left-0 right-0 h-1">
        <Progress value={progress} className="h-full" />
      </div>
      
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              {currentQuestion.text}
            </h2>

            {currentQuestion.type === 'text' ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  placeholder="Type your answer here..."
                  className="w-full text-2xl bg-transparent border-b-2 border-gray-300 focus:border-purple-500 outline-none px-2 py-4 transition-colors"
                  autoFocus
                />
                <Button 
                  onClick={handleNext}
                  disabled={!textInput.trim()}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full"
                >
                  Press Enter ↵
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {currentQuestion.choices?.map((choice) => (
                  <Button
                    key={choice}
                    onClick={() => handleChoice(choice)}
                    className="w-full text-left px-6 py-8 text-lg bg-white hover:bg-purple-50 border-2 border-gray-100 hover:border-purple-200 rounded-xl transition-all duration-200 text-gray-900 font-medium"
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="rounded-full"
          >
            <ChevronUp className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, sampleQuestions.length - 1))}
            disabled={currentQuestionIndex === sampleQuestions.length - 1}
            className="rounded-full"
          >
            <ChevronDown className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App