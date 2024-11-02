import useSound from 'use-sound'

export const useStopwatchSounds = () => {
  const [playCountdown] = useSound('/sounds/countdown.mp3', { volume: 0.5 })
  const [playBell] = useSound('/sounds/bell.mp3', { volume: 0.5 })

  return {
    playCountdown,
    playBell,
  }
}