import { Request, Response } from 'express'
import { Like, Repository } from 'typeorm'
import excel from 'exceljs'

import { connectionDatabase } from '../db'
import { getCharacterDetails, getMovieDetails } from '../utils/axios'
import { AddFavoriteFilm, MovieDetails } from '../interfaces/interfaces'
import { Characters } from '../entities/characters'
import { Movies } from '../entities/movies'
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

export const generateReport = async (req: Request, res: Response) => {
    const { id } = req.params

    const favouriteList: Favourites | null = await connectionDatabase.getRepository(Favourites).findOne({
        where: { id: parseInt(id) },
        relations: ['movies', 'movies.characters']
    })

    if (!favouriteList) {
        return res.status(400).json({ success: false, message: 'Favourite list with given ID does not exist.' })
    }

    // Create a new Excel workbook
    const workbook = new excel.Workbook()
    const worksheet = workbook.addWorksheet('Favorite List')

    // Set up the columns
    worksheet.columns = [
        { header: 'Characters', key: 'characters' },
        { header: 'Movies', key: 'movies' },
    ]

    // Retrieve distinct characters and movie titles from the favorite list
    const characters: Set<string> = new Set<string>
    const movies: string[] = []

    for (const movie of favouriteList.movies) {
        for (const character of movie.characters) {
            characters.add(character.name)
        }

        movies.push(movie.title)
    }

    let isFirstRow = true

    // Add data to the worksheet
    for (const character of characters) {
        let rowData: {characters: string, movies?: string} = { characters: character }

        if (isFirstRow) {
            rowData.movies = movies.join(',')
            isFirstRow = false
        }

        worksheet.addRow(rowData)
    }

    // Set column widths
    worksheet.getColumn(1).width = 30
    worksheet.getColumn(2).width = 40

    // Set the content type and disposition for the response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="favorite_list.xlsx"`)

    await workbook.xlsx.write(res)
    res.status(200).end()
}

export const addToFavorites = async (req: Request, res: Response) => {
    const { name, movieIds }: AddFavoriteFilm = req.body

    if (!name || !movieIds) {
        return res.status(400).json({ success: false, message: 'All fields must be provided.' })
    }

    if (!Array.isArray(movieIds)) {
        return res.status(400).json({ success: false, message: 'Field movieIds must be an array.' })
    }

    if (movieIds.some(movieId => typeof movieId !== 'number')) {
        return res.status(400).json({ success: false, message: 'All values in moveIds must be a numbers' })
    }

    const favouritesListRepository: Repository<Favourites> = await connectionDatabase.getRepository(Favourites)
    const existingFavouriteList: boolean = await favouritesListRepository.exist({ where: { name: name } })

    if (existingFavouriteList) {
        return res.status(400).json({ success: false, message: 'List with that name already exists.' })
    }

    let movies: MovieDetails[]

    try {
        movies = await _getMovies(movieIds)
    } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid movie IDs' });
    }

    const moviesRepository: Repository<Movies> = await connectionDatabase.getRepository(Movies)
    const savedMovies: Movies[] = await Promise.all(movies.map(movie => _saveMovie(moviesRepository, movie)))
    const createList: Favourites = await favouritesListRepository.create({ name, movies: savedMovies })
    await favouritesListRepository.save(createList)

    res.status(201).json({ success: true, id: createList.id })
}

async function _getMovies(movieIds: number[]): Promise<MovieDetails[]> {
    const responses = await Promise.all(movieIds.map((movieId: number) => getMovieDetails(movieId)))

    if (!responses.every(response => response.status === 200)) {
        throw new Error('Failed to fetch movie details')
    }

    // return only response body, not the entire axios objects
    return responses.map(response => response.data)
}

export const _saveMovie = async (moviesRepo: Repository<Movies>, movie: MovieDetails) => {
    const existingMovie: Movies | null = await moviesRepo.findOne({ where: { id: movie.episode_id } })

    if (existingMovie) {
        return existingMovie
    }

    const characters = await Promise.all(movie.characters.map(characterUrl => _saveCharacter(characterUrl)))

    const createMovie: Movies = await moviesRepo.create({
        id: movie.episode_id,
        title: movie.title,
        release_date: movie.release_date,
        characters
    })

    return await moviesRepo.save(createMovie)
}

export const _saveCharacter = async (characterUrl: string): Promise<Characters> => {
    const character = await getCharacterDetails(characterUrl)

    const charactersRepository: Repository<Characters> = await connectionDatabase.getRepository(Characters)
    const existingCharacter: Characters | null = await charactersRepository.findOne({
        where: { character_id: character.characterId }
    })

    if (existingCharacter) {
        return existingCharacter
    }

    const createCharacter: Characters = await charactersRepository.create({
        name: character.name,
        character_id: character.characterId
    })

    return await charactersRepository.save(createCharacter)
}