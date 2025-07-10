import { Router } from "express";

const router = Router()

router.get('/', (req, res) => {
  res.json({ nicole: 'Hello world' }).status(200)
})

export default router