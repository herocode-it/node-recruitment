import express from 'express'

import { connectionDatabase } from './db'
import { backendPort } from '../websiteConfig.json'
import { routes } from './routes'

connectionDatabase.initialize().then(() => {
    const app = express()

    app.use(express.json())
    routes(app)

    app.listen(backendPort, () => console.log(`Server started on port ${backendPort}`))
}).catch(err => console.log(`Error with connecting to DB - ${err.message}`))