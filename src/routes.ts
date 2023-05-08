import { Router } from 'express'

// ROUTES
import { getFilms } from './controllers/films'
import { addToFavorites, getFavorites, getFavourite } from './controllers/favorites'

export const routes = (router: Router) => {
    router.get('/api/films', getFilms)
    router.get('/api/favorites', getFavorites)
    router.get('/api/favorites/:id', getFavourite)
    router.post('/api/favorites', addToFavorites)
}
