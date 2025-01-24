export interface Stream {
  id: string
  streamKey: string
  channelName: string
  videoFilePath: string
  startDate: Date
  endDate: Date | null
  duration: number | null
  status: "ready" | "running" | "stopped"
}

