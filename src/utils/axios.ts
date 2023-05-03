import axios from 'axios'

export const getAxios = () => axios.create()

export const getMovieDetails = async (moveId: number) => {
    const { data } = await getAxios().get(`https://swapi.dev/api/films/${moveId}`)
    return data
}