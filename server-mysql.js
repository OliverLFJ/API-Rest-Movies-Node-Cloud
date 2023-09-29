import { createApp } from "./api.js";
import { MovieModel } from './mysql/movies.js'

createApp({ movieModel: MovieModel })