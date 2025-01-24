import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Stream } from "../types"
import { startStream, stopStream } from "../actions"
import { StreamForm } from "./StreamForm"

interface StreamListProps {
  streams: Stream[]
  onUpdateStream: (stream: Stream) => void
  onDeleteStream: (id: string) => void
}

export function StreamList({ streams, onUpdateStream, onDeleteStream }: StreamListProps) {
  const [editingStream, setEditingStream] = useState<Stream | null>(null)

  const handleStartStream = async (stream: Stream) => {
    try {
      const result = await startStream(stream)
      onUpdateStream({ ...stream, status: "running" })
    } catch (error) {
      console.error("Failed to start stream:", error)
    }
  }

  const handleStopStream = async (stream: Stream) => {
    try {
      await stopStream(stream.id)
      onUpdateStream({ ...stream, status: "stopped" })
    } catch (error) {
      console.error("Failed to stop stream:", error)
    }
  }

  const handleEditStream = (stream: Stream) => {
    setEditingStream(stream)
  }

  const handleUpdateStream = (updatedStream: Stream) => {
    onUpdateStream(updatedStream)
    setEditingStream(null)
  }

  return (
    <div className="space-y-4">
      {editingStream && (
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Edit Stream</h3>
          <StreamForm onAddStream={handleUpdateStream} editStream={editingStream} />
          <Button onClick={() => setEditingStream(null)}>Cancel Edit</Button>
        </div>
      )}
      {streams.map((stream) => (
        <div key={stream.id} className="border p-4 rounded-md">
          <h3 className="font-bold">{stream.channelName}</h3>
          <p>Status: {stream.status}</p>
          <p>Start: {stream.startDate.toLocaleString()}</p>
          <p>End: {stream.endDate ? stream.endDate.toLocaleString() : "Not set"}</p>
          <p>Duration: {stream.duration ? `${stream.duration} minutes` : "Not set"}</p>
          <div className="mt-2 space-x-2">
            {stream.status === "ready" && <Button onClick={() => handleStartStream(stream)}>Start Stream</Button>}
            {stream.status === "running" && <Button onClick={() => handleStopStream(stream)}>Stop Stream</Button>}
            <Button onClick={() => handleEditStream(stream)}>Edit</Button>
            <Button variant="destructive" onClick={() => onDeleteStream(stream.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

