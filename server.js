const express = require("express")
const { spawn } = require("child_process")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const streams = new Map()

app.post("/api/stream/start", (req, res) => {
  const { id, streamKey, videoFilePath, startDate, endDate, duration } = req.body

  const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`

  const startStream = () => {
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
      console.log(`FFmpeg stdout (${id}): ${data}`)
    })

    ffmpeg.stderr.on("data", (data) => {
      console.error(`FFmpeg stderr (${id}): ${data}`)
    })

    ffmpeg.on("close", (code) => {
      console.log(`FFmpeg process exited with code ${code} (${id})`)
      streams.delete(id)
    })

    streams.set(id, ffmpeg)

    // Schedule stream end if duration or endDate is set
    if (duration) {
      setTimeout(
        () => {
          const stream = streams.get(id)
          if (stream) {
            stream.kill("SIGINT")
            streams.delete(id)
          }
        },
        duration * 60 * 1000,
      )
    } else if (endDate) {
      const streamDuration = new Date(endDate).getTime() - Date.now()
      setTimeout(() => {
        const stream = streams.get(id)
        if (stream) {
          stream.kill("SIGINT")
          streams.delete(id)
        }
      }, streamDuration)
    }
  }

  const now = new Date()
  const streamStartDate = new Date(startDate)

  if (streamStartDate > now) {
    const delay = streamStartDate.getTime() - now.getTime()
    setTimeout(startStream, delay)
    res.json({ message: "Stream scheduled" })
  } else {
    startStream()
    res.json({ message: "Stream started" })
  }
})

app.post("/api/stream/stop/:id", (req, res) => {
  const { id } = req.params
  const stream = streams.get(id)
  if (stream) {
    stream.kill("SIGINT")
    streams.delete(id)
    res.json({ message: "Stream stopped" })
  } else {
    res.status(404).json({ message: "Stream not found" })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

