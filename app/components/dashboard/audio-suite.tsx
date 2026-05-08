"use client"

import { useState, useRef } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Upload,
  FileText,
  AudioLines,
  CheckCircle,
  Clock,
  Loader2,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Audio Player Widget
function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180)
  const [volume, setVolume] = useState([75])
  const audioRef = useRef<HTMLAudioElement>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <Card className="glass-card border-border/50 border-glow-green">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AudioLines className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Audio Brief</span>
          </div>
          <Badge className="bg-primary/20 text-primary border-0">ElevenLabs</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Track Info */}
        <div className="rounded-lg bg-muted/30 p-4">
          <h4 className="font-medium text-foreground">
            PeerChain Introduction
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            Learn how StudyStream converts learning into value
          </p>
        </div>

        {/* Waveform Visualization */}
        <div className="flex items-center justify-center gap-0.5 h-12 px-4">
          {Array.from({ length: 40 }).map((_, i) => {
            const isActive = i < (currentTime / duration) * 40
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isActive ? "bg-primary" : "bg-muted/50"
                } ${isPlaying && isActive ? "animate-pulse" : ""}`}
                style={{
                  height: `${Math.sin(i * 0.5) * 16 + 20}px`,
                }}
              />
            )
          })}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={(value) => setCurrentTime(value[0])}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-green"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 px-4">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={volume}
            max={100}
            step={1}
            onValueChange={setVolume}
            className="flex-1"
          />
        </div>

        <audio ref={audioRef} />
      </CardContent>
    </Card>
  )
}

// Text to Audio Component
function TextToAudio() {
  const [text, setText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateAudio = async () => {
    if (!text.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId: undefined }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate audio")
      }

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
    } catch (err) {
      setError("Failed to generate audio. Check ElevenLabs API key.")
      console.error("TTS error:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  const clearAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setText("")
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <AudioLines className="h-4 w-4 text-secondary" />
          <span className="text-muted-foreground">Generate Audio Brief</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          placeholder="Enter text to convert to speech..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-[100px] rounded-lg border border-border/50 bg-input/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        {audioUrl && (
          <div className="rounded-lg bg-muted/30 p-3">
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-blue"
            onClick={generateAudio}
            disabled={isGenerating || !text.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <AudioLines className="mr-2 h-4 w-4" />
                Generate Audio
              </>
            )}
          </Button>
          {audioUrl && (
            <Button variant="outline" size="icon" onClick={clearAudio}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function AudioSuite() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <AudioPlayer />
        <TextToAudio />
      </div>
    </div>
  )
}
