export interface AddFavoriteFilm {
    name: string,
    movieIds: number[],
}

export interface Films {
    id: string,
    url: string,
    title: string,
    release_date: string,
}

export interface MovieDetails {
    episode_id: number,
    title: string,
    release_date: string,
    characters: string[],
}
