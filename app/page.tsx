"use client"

import { useState } from "react"
import { StreamForm } from "./components/StreamForm"
import { StreamList } from "./components/StreamList"
import type { Stream } from "./types"

export default function Dashboard() {
  const [streams, setStreams] = useState<Stream[]>([])

  const addStream = (stream: Stream) => {
    setStreams([...streams, stream])
  }

  const updateStream = (updatedStream: Stream) => {
    setStreams(streams.map((stream) => (stream.id === updatedStream.id ? updatedStream : stream)))
  }

  const deleteStream = (id: string) => {
    setStreams(streams.filter((stream) => stream.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube Multi-Stream Dashboard</h1>
      <StreamForm onAddStream={addStream} />
      <StreamList streams={streams} onUpdateStream={updateStream} onDeleteStream={deleteStream} />
    </div>
  )
}

