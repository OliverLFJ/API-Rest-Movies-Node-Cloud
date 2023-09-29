import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'movies_db'
}

const connection = await mysql.createConnection(process.env.DATABASE_URL ?? config)

export class MovieModel {
    static async getAll({ genre }) {

        if (genre) {
            const lowerCaseGenre = genre.toLowerCase()
            const [genres] = await connection.query(
                'SELECT id, name FROM genre WHERE LOWER(name) = ?;',
                [lowerCaseGenre]
            )

            if (genres.length === 0) return []
            const [{ id }] = genres
            const [movies] = await connection.query(
                `SELECT movie.*
                FROM movie
                INNER JOIN genre_has_movie ON movie.id = genre_has_movie.movie_id
                INNER JOIN genre ON genre.id = genre_has_movie.genre_id
                WHERE genre.id = ?;`,
                [id]
            )
            return movies
        }
        const [movies] = await connection.query(
            'SELECT * FROM movie;'
        )
        return movies
    }

    static async getById({ id }) {
        const [movies] = await connection.query(
            'SELECT * FROM movie WHERE id = ?;', [id]
        )
        return movies
    }

    static async create({ input }) {
        const {
            genre: genreInput, // genre is an array
            title,
            year,
            duration,
            director,
            rate,
            poster
        } = input

        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult
        try {
            await connection.query(
                `INSERT INTO movie (id, title, year, director, duration, poster, rate)
             VALUES (?, ?, ?, ?, ?, ?, ?);`,
                [uuid, title, year, director, duration, poster, rate]
            );
        } catch (e) {
            // puede enviarle información sensible
            throw new Error('Error creating movie')
            // enviar la traza a un servicio interno
            // sendLog(e)
        }
        const [movies] = await connection.query(
            `SELECT * FROM movie WHERE id = ?`,
            [uuid]
        )

        return movies[0]
    }

    static async delete({ id }) {
        try {
            await connection.query(
                'DELETE FROM movie WHERE id = ?;', [id]
            )
            return true
        } catch (e) {
            throw new Error('Error deleteing movie')
        }
    }

    static async update({ id, input }) {

        const filteredUpdateValues = Object.entries(input)
            .filter(([key, value]) => value !== undefined)
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});

        if (Object.keys(filteredUpdateValues).length === 0) {
            return false;
        }

        const sql = `UPDATE movie 
                 SET ${Object.keys(filteredUpdateValues)
                .map(key => `${key} = ?`)
                .join(', ')}
                 WHERE id = ?;`;
        const values = [...Object.values(filteredUpdateValues), id];
        try {
            await connection.query(sql, values);
        } catch (e) {
            throw new Error('Error updating movie')
        }

        return true
    }
}