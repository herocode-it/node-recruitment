
# Favourite list of films

Node recruitment


## API Reference

#### Get all films from SWAPI API

```http
  GET /api/films
```

response:

```json
{
  "success": true,
  "data": [
      {
          "id": "1",
          "title": "A New Hope",
          "release_date": "1977-05-25"
      },
      {
          "id": "2",
          "title": "The Empire Strikes Back",
          "release_date": "1980-05-17"
      }
  ]
}
```

Possible errors:
- There are no movies.

***

#### Get own favorites list of films

```http
  GET /api/favorites
```

This route support pagination and search.

Example request:

```
/api/favorites?page=1&limit=10&search=movies
```

response:

```json
{
    "success": true,
    "data": {
        "favourites": [$favouriteFilms],
        "count": 5,
        "totalPages": 1,
        "currentPage": 1,
        "limit": 10
    }
}
```

Possible errors:
- Page and limit cannot be less than 1.

***

#### Get single favorite list of films

```http
  GET /api/favorites/{id}
```

Possible errors:
- Favourite list with given ID does not exist.

***

#### Get own favorites list of films

```http
  GET /api/favorites/{id}/file
```

This route generate and send to browser Excel file.
File has information about a specific favourite list provided in route.

File present information about all characters and movies in the favourite list.


Possible errors:
- Favourite list with given ID does not exist.

***

#### Create a new favourite list of films

```http
  POST /api/favorites
```

| Parameter | Type           | Description                                                                         |
| :-------- |:---------------|:------------------------------------------------------------------------------------|
| `name`    | `string`       | **Required**. Name for list                                                         |
| `movieIds`| `numbersArray` | **Required**. Array of numbers. Single number is present by movieId from SWAPI API. |


Example request:

```json
{
  "name": "My best movies",
  "movieIds": [1,3,4]
}
```

Possible errors:
- All fields must be provided.
- Field movieIds must be an array.
- All values in moveIds must be a numbers.
- List with that name already exists.
- Invalid movie IDs

