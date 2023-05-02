import { DataSource } from 'typeorm'
import ormConfig from '../ormConfig.json'

export const connectionDatabase = new DataSource({
    type: 'postgres',
    host: ormConfig.host,
    port: ormConfig.port,
    username: ormConfig.username,
    password: ormConfig.password,
    database: ormConfig.database,
    entities: ['src/entity/*.ts'],
    logging: false,
    synchronize: true
})