"use server"

import type { Stream } from "./types"

export async function startStream(stream: Stream) {
  const response = await fetch("http://localhost:3001/api/stream/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stream),
  })

  if (!response.ok) {
    throw new Error("Failed to start stream")
  }

  return await response.json()
}

export async function stopStream(streamId: string) {
  const response = await fetch(`http://localhost:3001/api/stream/stop/${streamId}`, {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error("Failed to stop stream")
  }

  return await response.json()
}

