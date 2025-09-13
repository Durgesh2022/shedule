'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'

interface TaskItem {
  id: string
  title: string
  time: string
  completed: boolean
  category: 'morning' | 'afternoon' | 'evening' | 'night' | 'late-night'
}

interface DayData {
  date: string
  tasks: TaskItem[]
  dsaProblems: number
  sqlJsQuestions: number
  internshipHours: number
  workoutCompleted: boolean
}

const defaultTasks: Omit<TaskItem, 'completed'>[] = [
  // Morning
  { id: '1', title: 'Wake up, freshen up, drink water', time: '9:30 – 9:45', category: 'morning' },
  { id: '2', title: 'Light breakfast/snack', time: '9:45 – 10:00', category: 'morning' },
  { id: '3', title: 'Classes (focus on learning)', time: '10:00 – 2:00', category: 'morning' },
  
  // Afternoon
  { id: '4', title: 'Lunch + rest', time: '2:00 – 2:45', category: 'afternoon' },
  { id: '5', title: 'SQL/JS (2 questions)', time: '2:45 – 3:15', category: 'afternoon' },
  { id: '6', title: 'Workout (fixed daily anchor)', time: '3:30 – 4:30', category: 'afternoon' },
  
  // Evening
  { id: '7', title: 'Internship deep work block', time: '4:45 – 8:00', category: 'evening' },
  { id: '8', title: 'Dinner', time: '8:00 – 8:30', category: 'evening' },
  
  // Night
  { id: '9', title: 'DSA (2 medium/hard problems)', time: '8:30 – 10:00', category: 'night' },
  { id: '10', title: 'Break (walk / music)', time: '10:00 – 10:15', category: 'night' },
  { id: '11', title: 'DSA (2 more problems)', time: '10:15 – 11:30', category: 'night' },
  { id: '12', title: 'SQL/JS (1–2 questions)', time: '11:30 – 12:00', category: 'night' },
  
  // Late Night
  { id: '13', title: 'Internship wrap-up / project tasks', time: '12:00 – 1:00', category: 'late-night' },
  { id: '14', title: 'Relax (light walk, music, journaling)', time: '1:00 – 1:30', category: 'late-night' },
  { id: '15', title: 'Optional learning (revision, notes)', time: '1:30 – 2:30', category: 'late-night' },
  { id: '16', title: 'Shutdown (no screens, prepare for sleep)', time: '2:30 – 3:00', category: 'late-night' },
]

export default function Home() {
  const [currentDate, setCurrentDate] = useState('')
  const [dayData, setDayData] = useState<DayData>({
    date: '',
    tasks: [],
    dsaProblems: 0,
    sqlJsQuestions: 0,
    internshipHours: 0,
    workoutCompleted: false
  })

  // Initialize or reset daily data
  useEffect(() => {
    const today = new Date().toDateString()
    setCurrentDate(today)
    
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('scheduleData')
      if (savedData) {
        const parsed: DayData = JSON.parse(savedData)
        if (parsed.date === today) {
          setDayData(parsed)
        } else {
          // New day - reset data
          const newDayData: DayData = {
            date: today,
            tasks: defaultTasks.map(task => ({ ...task, completed: false })),
            dsaProblems: 0,
            sqlJsQuestions: 0,
            internshipHours: 0,
            workoutCompleted: false
          }
          setDayData(newDayData)
          localStorage.setItem('scheduleData', JSON.stringify(newDayData))
        }
      } else {
        // First time - initialize
        const newDayData: DayData = {
          date: today,
          tasks: defaultTasks.map(task => ({ ...task, completed: false })),
          dsaProblems: 0,
          sqlJsQuestions: 0,
          internshipHours: 0,
          workoutCompleted: false
        }
        setDayData(newDayData)
        localStorage.setItem('scheduleData', JSON.stringify(newDayData))
      }
    }
  }, [])

  // Save data to localStorage whenever dayData changes
  useEffect(() => {
    if (dayData.date && typeof window !== 'undefined') {
      localStorage.setItem('scheduleData', JSON.stringify(dayData))
    }
  }, [dayData])

  const toggleTask = (taskId: string) => {
    setDayData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }))
  }

  const updateCounter = (field: keyof Pick<DayData, 'dsaProblems' | 'sqlJsQuestions' | 'internshipHours'>, increment: boolean) => {
    setDayData(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] + (increment ? 1 : -1))
    }))
  }

  const toggleWorkout = () => {
    setDayData(prev => ({
      ...prev,
      workoutCompleted: !prev.workoutCompleted
    }))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'morning': return '🌅'
      case 'afternoon': return '🍴'
      case 'evening': return '💻'
      case 'night': return '📚'
      case 'late-night': return '🌙'
      default: return '⏰'
    }
  }

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'morning': return 'Morning'
      case 'afternoon': return 'Afternoon'
      case 'evening': return 'Evening (Internship Work)'
      case 'night': return 'Night (Study Focus)'
      case 'late-night': return 'Late Night'
      default: return 'Schedule'
    }
  }

  const getCompletionRate = () => {
    if (dayData.tasks.length === 0) return 0
    const completed = dayData.tasks.filter(task => task.completed).length
    return Math.round((completed / dayData.tasks.length) * 100)
  }

  const groupedTasks = defaultTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = []
    }
    acc[task.category].push(task)
    return acc
  }, {} as Record<string, typeof defaultTasks>)

  return (
    <>
      <Head>
        <title>Daily Study & Work Schedule</title>
        <meta name="description" content="Track your daily study and work schedule" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Daily Study & Work Plan
            </h1>
            <p className="text-gray-600 mb-4">{currentDate}</p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Daily Progress</span>
                <span className="text-sm font-medium text-gray-700">{getCompletionRate()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionRate()}%` }}
                ></div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{dayData.dsaProblems}/4</div>
                <div className="text-sm text-gray-600">DSA Problems</div>
                <div className="flex justify-center gap-2 mt-2">
                  <button 
                    onClick={() => updateCounter('dsaProblems', false)}
                    className="bg-red-500 text-white w-6 h-6 rounded text-xs hover:bg-red-600 transition-colors"
                  >-</button>
                  <button 
                    onClick={() => updateCounter('dsaProblems', true)}
                    className="bg-green-500 text-white w-6 h-6 rounded text-xs hover:bg-green-600 transition-colors"
                  >+</button>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{dayData.sqlJsQuestions}/4</div>
                <div className="text-sm text-gray-600">SQL/JS Questions</div>
                <div className="flex justify-center gap-2 mt-2">
                  <button 
                    onClick={() => updateCounter('sqlJsQuestions', false)}
                    className="bg-red-500 text-white w-6 h-6 rounded text-xs hover:bg-red-600 transition-colors"
                  >-</button>
                  <button 
                    onClick={() => updateCounter('sqlJsQuestions', true)}
                    className="bg-green-500 text-white w-6 h-6 rounded text-xs hover:bg-green-600 transition-colors"
                  >+</button>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{dayData.internshipHours}/5</div>
                <div className="text-sm text-gray-600">Internship Hours</div>
                <div className="flex justify-center gap-2 mt-2">
                  <button 
                    onClick={() => updateCounter('internshipHours', false)}
                    className="bg-red-500 text-white w-6 h-6 rounded text-xs hover:bg-red-600 transition-colors"
                  >-</button>
                  <button 
                    onClick={() => updateCounter('internshipHours', true)}
                    className="bg-green-500 text-white w-6 h-6 rounded text-xs hover:bg-green-600 transition-colors"
                  >+</button>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {dayData.workoutCompleted ? '✓' : '○'}
                </div>
                <div className="text-sm text-gray-600">Workout</div>
                <button 
                  onClick={toggleWorkout}
                  className={`mt-2 px-3 py-1 rounded text-xs transition-colors ${
                    dayData.workoutCompleted 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                  }`}
                >
                  {dayData.workoutCompleted ? 'Done' : 'Mark Done'}
                </button>
              </div>
            </div>
          </div>

          {/* Schedule Sections */}
          {Object.entries(groupedTasks).map(([category, tasks]) => (
            <div key={category} className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                {getCategoryTitle(category)}
              </h2>
              
              <div className="space-y-3">
                {tasks.map(task => {
                  const currentTask = dayData.tasks.find(t => t.id === task.id)
                  const isCompleted = currentTask?.completed || false
                  
                  return (
                    <div 
                      key={task.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        isCompleted 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50 hover:border-blue-200'
                      }`}
                      onClick={() => toggleTask(task.id)}
                    >
                      <button
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {isCompleted && '✓'}
                      </button>
                      
                      <div className="flex-1">
                        <div className={`font-medium ${
                          isCompleted ? 'text-green-700 line-through' : 'text-gray-800'
                        }`}>
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500">{task.time}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Key Points */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Key Points
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>• DSA = 4 problems daily (split evening/night)</div>
              <div>• SQL/JS = 3–4 daily (spread across day)</div>
              <div>• Internship = 4–5 hours daily</div>
              <div>• Workout = fixed 3:30 – 4:30 PM</div>
              <div>• Sleep = ~6.5 hours (adjust later if needed)</div>
              <div>• Wake up at 9:30 AM, sleep around 3:00 AM</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}