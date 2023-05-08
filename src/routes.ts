import { Router } from 'express'

// ROUTES
import { getFilms } from './controllers/films'
import { addToFavorites, getFavorites, getFavourite, generateReport } from './controllers/favorites'

export const routes = (router: Router) => {
    router.get('/api/films', getFilms)
    router.get('/api/favorites', getFavorites)
    router.get('/api/favorites/:id', getFavourite)
    router.get('/api/favorites/:id/file', generateReport)
    router.post('/api/favorites', addToFavorites)
}