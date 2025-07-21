# Movies Module Documentation

## Overview

The Movies module integrates with The Movie Database (TMDB) API to provide comprehensive movie information including search, discovery, genres, and detailed movie data.

## API Endpoints

### Movie Routes

- `GET /movies/search` - Search movies by name/keywords
- `GET /movies/genres` - Get all available movie genres
- `GET /movies/popular` - Get popular movies (paginated)
- `GET /movies/now-playing` - Get currently playing movies
- `GET /movies/discover` - Discover movies with filters
- `GET /movies/:id` - Get detailed movie information by ID

## Custom Decorators

### `@MoviesApiTags()`

Applies the "Movies" tag to controllers for Swagger grouping.

### `@SearchMoviesApiDocs()`

Documentation for movie search endpoint including:

- Query parameter validation
- Success response with movie list
- Error handling for invalid queries

### `@GetGenresApiDocs()`

Documentation for genres endpoint:

- Success response with genres list
- No parameters required

### `@GetPopularMoviesApiDocs()`

Documentation for popular movies endpoint:

- Optional page parameter for pagination
- Paginated movie results response

### `@GetNowPlayingApiDocs()`

Documentation for now playing movies:

- Optional page parameter
- Current theater releases

### `@DiscoverMoviesApiDocs()`

Documentation for movie discovery with filters:

- Multiple optional query parameters (page, year, genres)
- Filtered movie results

### `@GetMovieByIdApiDocs()`

Documentation for movie details endpoint:

- Required movie ID parameter
- Detailed movie information response
- Not found error handling

## Usage Examples

### Basic Movies Controller

```typescript
import { Controller, Get } from '@nestjs/common';
import { MoviesApiTags, SearchMoviesApiDocs } from './decorators';

@Controller('movies')
@MoviesApiTags()
export class MoviesController {
  @Get('search')
  @SearchMoviesApiDocs()
  async searchMovies(@Query() params: SearchMovieDto) {
    // Implementation
  }
}
```

### Search with Filters

```typescript
@Get('discover')
@DiscoverMoviesApiDocs()
async discoverMovies(@Query() filters: DiscoverMoviesDto) {
  return this.moviesService.discoverMovies(filters);
}
```

## DTOs

### Request DTOs

#### `SearchMovieDto`

- `query`: Movie title or keywords (required)

#### `DiscoverMoviesDto`

- `page`: Page number (optional, default: 1)
- `year`: Release year filter (optional)
- `with_genres`: Genre IDs comma-separated (optional)

### Response DTOs

#### `MovieDto`

Basic movie information:

- `id`: TMDB movie ID
- `title`: Movie title
- `overview`: Plot summary
- `poster_path`: Poster image URL
- `release_date`: Release date
- `vote_average`: Average rating
- `genre_ids`: Array of genre IDs

#### `SearchMovieResponseDto`

Paginated movie search results:

- `page`: Current page number
- `results`: Array of MovieDto
- `total_pages`: Total available pages
- `total_results`: Total number of results

#### `MovieDetailsDto`

Detailed movie information:

- All MovieDto fields plus:
- `runtime`: Movie duration in minutes
- `genres`: Full genre objects with names
- `production_companies`: Production company details
- `budget`: Movie budget
- `revenue`: Box office revenue
- `tagline`: Movie tagline
- `homepage`: Official website

#### `GenresResponseDto`

- `genres`: Array of genre objects with ID and name

## External Integration

### TMDB API

This module integrates with The Movie Database API:

- **Base URL**: `https://api.themoviedb.org/3`
- **Authentication**: API Key required
- **Rate Limits**: Follow TMDB rate limiting guidelines
- **Image URLs**: Combine with base image URL for full paths

### Configuration

Ensure TMDB API key is configured in your environment:

```env
TMDB_API_KEY=your_api_key_here
```

## Benefits

1. **Comprehensive Search**: Multiple search and discovery options
2. **Rich Data**: Detailed movie information from TMDB
3. **Pagination**: Built-in pagination support
4. **Filtering**: Genre and year-based filtering
5. **Clean Documentation**: Self-documenting API with Swagger
6. **Type Safety**: Strong typing with DTOs
7. **Error Handling**: Proper error responses and validation
