import { Request, Response } from 'express'
import { Like, Repository } from 'typeorm'

import { connectionDatabase } from '../db'
import { Favourites } from '../entities/favourites'
import { parseValueAsInt, getStringOrDefault } from '../utils/utils'

export const getFavorites = async (req: Request, res: Response) => {
    const page: number = parseValueAsInt(req.query.page, 1)
    const limit: number = parseValueAsInt(req.query.limit, 10)

    if (page < 1 || limit < 1) {
        return res.status(400).json({ success: false, message: 'Page and limit cannot be less than 1.' })
    }

    const search = getStringOrDefault(req.query.search, '')
    const skip = (page - 1) * limit

    const favouritesRepository: Repository<Favourites> = connectionDatabase.getRepository(Favourites)

    const [favourites, count] = await favouritesRepository.findAndCount({
        where: search ? { name: Like(`%${search}%`) } : {},
        relations: ['movies'],
        skip,
        take: limit
    })

    res.status(200).json({
        success: true,
        data: {
            favourites,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            limit
        }
    })
}

export const getFavourite = async (req: Request, res: Response) => {
    const { id } = req.params

    const favourite: Favourites | null = await connectionDatabase.getRepository(Favourites).findOne({
        where: { id: parseInt(id) },
        relations: ['movies', 'movies.characters']
    })

    if (!favourite) {
        return res.status(400).json({ success: false, message: 'Favourite list with given ID does not exist.' })
    }

    res.status(200).json({ success: true, data: favourite })
}