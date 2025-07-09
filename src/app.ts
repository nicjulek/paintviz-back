import express from 'express'

const app = express()

app.use(express.json())

app.get('/hello-world', (req, res) => {
  res.json({ nicole: 'Hello world' }).status(200)
})

export default app