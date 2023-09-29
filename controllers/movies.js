import { validateMovie, validatePartialMovie } from "../schemas/movies.js"

export class MovieController {

    constructor({ movieModel }) {
        this.movieModel = movieModel
    }

    getAll = async (req, res) => {
        const { genre } = req.query
        const movies = await this.movieModel.getAll({ genre })
        res.json(movies)
    }

    getById = async (req, res) => {
        const { id } = req.params
        const movieFind = await this.movieModel.getById({ id })
        if (movieFind) {
            return res.json(movieFind)
        } else {
            return res.status(404).json({ message: 'Movie not found' })
        }
    }

    create = async (req, res) => {
        const result = validateMovie(req.body)
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const newMovie = await this.movieModel.create({ input: result.data })
        return res.status(201).json(newMovie)
    }

    update = async (req, res) => {
        const result = validatePartialMovie(req.body)
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const { id } = req.params
        const movieUpdated = await this.movieModel.update({ id, input: result.data })
        if (movieUpdated === false) {
            return res.status(404).json({ message: 'Movie not found' })
        }

        return res.status(200).json({ message: 'Movie Updated' })
    }

    delete = async (req, res) => {
        const { id } = req.params
        const movieStatus = await this.movieModel.delete({ id })
        if (movieStatus === false) {
            return res.status(404).json({ message: 'Movie not found' })
        }
        return res.json({ message: 'Movie Deleted' })
    }
}
