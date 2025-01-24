import { NextResponse } from "next/server"
import { spawn } from "child_process"

export async function POST(request: Request) {
  const { streamKey, channelName, videoFilePath, startDate, endDate } = await request.json()

  const now = new Date()
  const delayMs = new Date(startDate).getTime() - now.getTime()

  if (delayMs > 0) {
    // If the start time is in the future, schedule the stream
    setTimeout(() => runFFmpegStream(streamKey, channelName, videoFilePath, new Date(endDate)), delayMs)
    return NextResponse.json({ message: `Stream scheduled to start at ${new Date(startDate).toLocaleString()}` })
  } else {
    // If the start time is now or in the past, start the stream immediately
    runFFmpegStream(streamKey, channelName, videoFilePath, new Date(endDate))
    return NextResponse.json({ message: "Stream started" })
  }
}

function runFFmpegStream(streamKey: string, channelName: string, videoFilePath: string, endDate: Date) {
  const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`

  const ffmpeg = spawn("ffmpeg", [
    "-re",
    "-i",
    videoFilePath,
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-maxrate",
    "3000k",
    "-bufsize",
    "6000k",
    "-pix_fmt",
    "yuv420p",
    "-g",
    "50",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-ar",
    "44100",
    "-f",
    "flv",
    rtmpUrl,
  ])

  ffmpeg.stdout.on("data", (data) => {
    console.log(`FFmpeg stdout: ${data}`)
  })

  ffmpeg.stderr.on("data", (data) => {
    console.error(`FFmpeg stderr: ${data}`)
  })

  ffmpeg.on("close", (code) => {
    console.log(`FFmpeg process exited with code ${code}`)
  })

  // Stop the stream at the end date
  const streamDuration = endDate.getTime() - Date.now()
  setTimeout(() => {
    ffmpeg.kill("SIGINT")
  }, streamDuration)
}

