import axios from 'axios'

export const getAxios = () => axios.create()

export const getMovieDetails = async (movieId: number) => {
    const { data } = await getAxios().get(`https://swapi.dev/api/films/${movieId}`)
    return data
}