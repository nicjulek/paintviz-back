import 'reflect-metadata'
import './container'
import cors from 'cors'
import express from 'express'
import routes from './routes'

const app = express()

app.use(cors({
    origin: [
        'http://localhost:3000',  
        'http://127.0.0.1:3000',
        'http://localhost:3333',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'Accept',
        'Origin'
    ]
}));

app.use(express.json())

app.use(routes)

export default app