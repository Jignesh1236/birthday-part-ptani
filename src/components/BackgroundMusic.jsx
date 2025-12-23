"use client"

import { useState, useRef, useEffect } from "react"
import { Music, Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"

export default function BackgroundMusic() {
  const audioContextRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.15)
  const melodyIndexRef = useRef(0)

  // Festive melody notes (frequency in Hz)
  const melody = [
    262, 294, 330, 349, 392, 440, 494, 523,
    523, 494, 440, 392, 349, 330, 294, 262,
    392, 440, 494, 523, 523, 494, 440, 392,
    330, 294, 262, 294, 330, 349, 392, 440
  ]

  // Initialize audio context and create oscillator
  const initAudio = () => {
    if (audioContextRef.current) return

    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    audioContextRef.current = audioContext

    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.type = "sine"
    oscillator.connect(gain)
    gain.connect(audioContext.destination)

    oscillatorRef.current = oscillator
    gainRef.current = gain

    oscillator.start()

    // Play melody loop
    playMelody()
  }

  const playMelody = () => {
    if (!oscillatorRef.current || !gainRef.current) return

    const noteIndex = melodyIndexRef.current % melody.length
    const frequency = melody[noteIndex]
    const audioContext = audioContextRef.current

    oscillatorRef.current.frequency.setTargetAtTime(
      frequency,
      audioContext.currentTime,
      0.05
    )

    // Note duration: 0.3 seconds
    melodyIndexRef.current++

    setTimeout(playMelody, 300)
  }

  useEffect(() => {
    if (isPlaying) {
      initAudio()
      if (gainRef.current) {
        gainRef.current.gain.setTargetAtTime(
          isMuted ? 0 : volume,
          audioContextRef.current?.currentTime || 0,
          0.1
        )
      }
    } else {
      if (gainRef.current) {
        gainRef.current.gain.setTargetAtTime(0, audioContextRef.current?.currentTime || 0, 0.1)
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (gainRef.current && audioContextRef.current) {
      gainRef.current.gain.setTargetAtTime(
        isMuted || !isPlaying ? 0 : volume,
        audioContextRef.current.currentTime,
        0.1
      )
    }
  }, [volume, isMuted])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
      className="fixed bottom-6 left-6 z-50 flex flex-col gap-3"
    >
      {/* Volume Slider */}
      {isPlaying && !isMuted && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-full border border-white/20"
        >
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => setVolume(e.target.value / 100)}
            className="w-24 h-1 cursor-pointer accent-pink-400"
          />
          <Volume2 size={16} className="text-white/60" />
        </motion.div>
      )}

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 group"
      >
        {isPlaying ? (
          <Music size={20} className="text-white animate-pulse" />
        ) : (
          <Music size={20} className="text-white" />
        )}
      </button>

      {/* Mute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 transition-all duration-300"
      >
        {isMuted ? (
          <VolumeX size={18} className="text-white/60" />
        ) : (
          <Volume2 size={18} className="text-white/60" />
        )}
      </button>
    </motion.div>
  )
}
