import { Request, Response } from 'express'

import { getAxios } from '../utils/axios'

interface Film {
    id: string,
    url: string,
    title: string,
    release_date: string
}

export const getFilms = async (req: Request, res: Response) => {
    let response

    try {
        response = await getAxios().get('https://swapi.dev/api/films')
    } catch (err) {
        console.log(err)
        return
    }

    if (response.data.count < 1) {
        return res.status(400).json({ success: false, message: 'There are no movies.' })
    }

    const films: Film[] = response.data.results.map((film: Film) => {
        return {
            id: film.url.split('/')[5],
            title: film.title,
            release_date: film.release_date
        }
    })

    res.status(200).json({ success: true, data: films })
}