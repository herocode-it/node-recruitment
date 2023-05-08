import axios from 'axios'

export const getAxios = () => axios.create()

export const getMovieDetails = async (movieId: number) => {
    return await getAxios().get(`https://swapi.dev/api/films/${movieId}`)
}

export const getCharacterDetails = async (characterUrl: string) => {
    const { data } = await getAxios().get(characterUrl)
    return {
        characterId: parseInt(data.url.split('/')[5]),
        name: data.name
    }
}