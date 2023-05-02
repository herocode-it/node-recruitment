import { Router } from 'express'

// ROUTES
import { getFilms } from './controllers/film'

export const routes = (router: Router) => {
    router.get('/films', getFilms)
}
