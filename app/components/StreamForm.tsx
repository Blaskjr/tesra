import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from "./DatePickerWithRange"
import type { Stream } from "../types"
import { Switch } from "@/components/ui/switch"

interface StreamFormProps {
  onAddStream: (stream: Stream) => void
  editStream?: Stream
}

export function StreamForm({ onAddStream, editStream }: StreamFormProps) {
  const [streamKey, setStreamKey] = useState(editStream?.streamKey || "")
  const [channelName, setChannelName] = useState(editStream?.channelName || "")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | null } | undefined>(
    editStream ? { from: editStream.startDate, to: editStream.endDate } : undefined,
  )
  const [duration, setDuration] = useState(editStream?.duration || "")
  const [isScheduled, setIsScheduled] = useState(!!editStream?.startDate)
  const [streamNow, setStreamNow] = useState(!editStream?.startDate)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!streamKey || !channelName || !videoFile) {
      alert("Please fill in all required fields")
      return
    }

    const newStream: Stream = {
      id: editStream?.id || Date.now().toString(),
      streamKey,
      channelName,
      videoFilePath: videoFile.name,
      startDate: isScheduled ? dateRange?.from || new Date() : new Date(),
      endDate: isScheduled ? dateRange?.to || null : null,
      duration: streamNow && duration ? Number.parseInt(duration) : null,
      status: "ready",
    }

    onAddStream(newStream)

    // Reset form
    setStreamKey("")
    setChannelName("")
    setVideoFile(null)
    setDateRange(undefined)
    setDuration("")
    setIsScheduled(false)
    setStreamNow(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
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

      <div className="flex items-center space-x-2">
        <Switch id="schedule" checked={isScheduled} onCheckedChange={setIsScheduled} />
        <Label htmlFor="schedule">Schedule Stream</Label>
      </div>

      {isScheduled && (
        <div>
          <Label>Schedule Stream</Label>
          <DatePickerWithRange setDateRange={setDateRange} allowEndDateNull={true} />
        </div>
      )}

      {!isScheduled && (
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter duration in minutes (optional)"
          />
        </div>
      )}

      <Button type="submit">{editStream ? "Update Stream" : "Add Stream"}</Button>
    </form>
  )
}

