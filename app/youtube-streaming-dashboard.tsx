"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from "./date-range-picker"
import { startStream } from "./actions"

export default function YouTubeStreamingDashboard() {
  const [streamKey, setStreamKey] = useState("")
  const [channelName, setChannelName] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [status, setStatus] = useState("")

  const handleStreamNow = async () => {
    if (!streamKey || !channelName || !videoFile) {
      setStatus("Please fill in all required fields")
      return
    }

    setStatus("Starting stream...")
    try {
      const result = await startStream({
        streamKey,
        channelName,
        videoFilePath: videoFile.name,
        startDate: new Date(),
        endDate: new Date(Date.now() + 3600000), // Stream for 1 hour by default
      })
      setStatus(result.message)
    } catch (error) {
      setStatus("Failed to start stream. Please try again.")
      console.error(error)
    }
  }

  const handleScheduleStream = async () => {
    if (!streamKey || !channelName || !videoFile || !dateRange) {
      setStatus("Please fill in all required fields and select a date range")
      return
    }

    setStatus("Scheduling stream...")
    try {
      const result = await startStream({
        streamKey,
        channelName,
        videoFilePath: videoFile.name,
        startDate: dateRange.from,
        endDate: dateRange.to,
      })
      setStatus(result.message)
    } catch (error) {
      setStatus("Failed to schedule stream. Please try again.")
      console.error(error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">YouTube Streaming Dashboard</h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="streamKey">Stream Key</Label>
          <Input
            id="streamKey"
            type="password"
            value={streamKey}
            onChange={(e) => setStreamKey(e.target.value)}
            placeholder="Enter your YouTube stream key"
          />
        </div>

        <div>
          <Label htmlFor="channelName">Channel Name</Label>
          <Input
            id="channelName"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Enter your YouTube channel name"
          />
        </div>

        <div>
          <Label htmlFor="videoFile">Video File</Label>
          <Input
            id="videoFile"
            type="file"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            accept="video/*"
          />
        </div>

        <div>
          <Label>Schedule Stream</Label>
          <DatePickerWithRange setDateRange={setDateRange} />
        </div>

        <div className="flex space-x-4">
          <Button onClick={handleStreamNow}>Stream Now</Button>
          <Button onClick={handleScheduleStream}>Schedule Stream</Button>
        </div>

        {status && <p className="text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  )
}

