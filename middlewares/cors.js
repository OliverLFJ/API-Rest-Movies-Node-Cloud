import cors from 'cors'

const ALLOW_METHODS = [
    'http://localhost/8080',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5500/'
]

export const corseMiddleware = ({ acceptedOrigins = ALLOW_METHODS } = {}) => cors({
    origin: (origin, callback) => {
        if (acceptedOrigins.includes(origin) || !origin) {
            return callback(null, true)
        }
        return callback(new Error('Not Alowed By CORS'))
    }
})