import { useState, useEffect } from 'react'
import { useStopwatchSounds } from '../hooks/useStopwatchSounds'

interface StopwatchProps {
  rounds: number
  roundDuration: number
  breakDuration: number
}

const Stopwatch = ({ rounds, roundDuration, breakDuration }: StopwatchProps) => {
  const [timeLeft, setTimeLeft] = useState(roundDuration)
  const [currentRound, setCurrentRound] = useState(1)
  const [isBreak, setIsBreak] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const { playCountdown, playBell } = useStopwatchSounds()

  useEffect(() => {
    let interval: number | undefined

    if (countdown !== null) {
      if (countdown > 0) {
        playCountdown()
        interval = setInterval(() => {
          setCountdown(prev => prev! - 1)
        }, 1000)
      } else {
        setCountdown(null)
        setIsRunning(true)
        playBell() // Play bell when workout starts
      }
    } else if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      playBell() // Play bell at the end of each round/break
      if (isBreak) {
        setIsBreak(false)
        setCurrentRound((prev) => prev + 1)
        setTimeLeft(roundDuration)
      } else if (currentRound < rounds) {
        setIsBreak(true)
        setTimeLeft(breakDuration)
      } else {
        setIsRunning(false)
      }
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isBreak, currentRound, rounds, roundDuration, breakDuration, countdown, playCountdown, playBell])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartStop = () => {
    if (!isRunning && timeLeft === roundDuration && currentRound === 1 && !isBreak) {
      setCountdown(3)
    } else {
      setIsRunning(!isRunning)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(roundDuration)
    setCurrentRound(1)
    setIsBreak(false)
    setCountdown(null)
  }

  const getStatus = () => {
    if (countdown !== null) return 'Get Ready!'
    if (currentRound > rounds) return 'Complete!'
    return isBreak ? 'Break Time!' : `Round ${currentRound}`
  }

  const getBgColor = () => {
    if (countdown !== null) return 'bg-yellow-500'
    if (currentRound > rounds) return 'bg-blue-500'
    if (!isRunning) return 'bg-black'
    return isBreak ? 'bg-red-500' : 'bg-green-500'
  }

  return (
    <div className={`min-h-screen w-full fixed inset-0 transition-colors duration-300 ${getBgColor()} flex items-center justify-center`}>
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">{getStatus()}</h2>
        <div className="text-6xl font-mono mb-6">
          {countdown !== null ? countdown : formatTime(timeLeft)}
        </div>
        <div className="space-x-4">
          <button
            onClick={handleStartStop}
            className={`px-6 py-2 rounded-full font-semibold ${
              isRunning || countdown !== null
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white transition-colors duration-200`}
          >
            {isRunning || countdown !== null ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white font-semibold transition-colors duration-200"
          >
            Reset
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {currentRound <= rounds && countdown === null && `${rounds - currentRound + 1} rounds remaining`}
        </div>
      </div>
    </div>
  )
}

export default Stopwatch