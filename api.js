import express, { json } from 'express'
import { createMovieRouter } from './routes/movies.js'
import { corseMiddleware } from './middlewares/cors.js'
import 'dotenv/config'

export const createApp = ({ movieModel }) => {
    const app = express()
    const PORT = process.env.PORT ?? 1234
    app.use(json())
    app.disable('x-powered-by')
    app.use(corseMiddleware())
    app.use('/movies', createMovieRouter({ movieModel }))
    app.listen(PORT, () => {
        console.log(`Puerto en ${PORT}`)
    })
}
