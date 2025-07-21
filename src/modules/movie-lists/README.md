# Movie Lists Module Documentation

## Overview

The Movie Lists module allows authenticated users to create, manage, and organize personalized movie collections. Users can create themed lists, add/remove movies, and manage their collections with full CRUD operations.

## API Endpoints

### Movie Lists Routes (All require authentication)

- `POST /movie-lists` - Create a new movie list
- `GET /movie-lists` - Get user's movie lists (paginated)
- `POST /movie-lists/movie` - Add a movie to a list
- `GET /movie-lists/:id` - Get movies from a specific list
- `PATCH /movie-lists/:id` - Update movie list details
- `DELETE /movie-lists/:id` - Delete a movie list
- `DELETE /movie-lists/movie` - Remove a movie from a list

## Custom Decorators

### `@MovieListsApiTags()`

Applies the "Movie Lists" tag and Bearer authentication to controllers.

### `@CreateListApiDocs()`

Documentation for list creation endpoint:

- Request body validation
- Success response with created list
- Authentication and validation error handling

### `@GetMyListsApiDocs()`

Documentation for user's lists retrieval:

- Pagination parameters
- Paginated response with meta information
- Authentication requirement

### `@AddMovieToListApiDocs()`

Documentation for adding movies to lists:

- List ID and movie ID validation
- Updated list response
- Error handling for invalid IDs

### `@GetMoviesByListIdApiDocs()`

Documentation for retrieving movies from a list:

- UUID parameter validation
- Complete list with movie details
- Not found error handling

### `@UpdateListApiDocs()`

Documentation for updating list information:

- UUID parameter and body validation
- Updated list response
- Error handling for invalid data

### `@DeleteListApiDocs()`

Documentation for deleting lists:

- UUID parameter validation
- No content response
- Not found error handling

### `@RemoveMovieFromListApiDocs()`

Documentation for removing movies from lists:

- List ID and movie ID validation
- Updated list response
- Error handling for missing resources

## Usage Examples

### Basic Movie Lists Controller

```typescript
import { Controller, Post, Get } from '@nestjs/common';
import { MovieListsApiTags, CreateListApiDocs } from './decorators';

@Controller('movie-lists')
@MovieListsApiTags()
export class MovieListsController {
  @Post()
  @CreateListApiDocs()
  async createList(@Body() data: CreateMovieListDto) {
    // Implementation
  }
}
```

### Protected Routes with Authentication

```typescript
@UseGuards(JwtAuthGuard)
@Controller('movie-lists')
@AuthRequired()
@MovieListsApiTags()
export class MovieListsController {
  // All endpoints require authentication
}
```

## DTOs

### Request DTOs

#### `CreateMovieListDto`

- `name`: List name (required)
- `description`: List description (optional)
- `genreId`: TMDB genre ID (required)
- `genreName`: Genre name (required)

#### `AddMovieToListDto`

- `listId`: Movie list UUID (required)
- `movieId`: TMDB movie ID (required)

#### `UpdateMovieListDto`

- `name`: Updated list name (required)
- `description`: Updated description (optional)

#### `RemoveMovieFromListDto`

- `listId`: Movie list UUID (required)
- `movieId`: TMDB movie ID to remove (required)

#### `PaginationQueryDto`

- `page`: Page number (optional, default: 1, min: 1)
- `limit`: Items per page (optional, default: 10, max: 100)

### Response DTOs

#### `MovieListDto`

Complete movie list information:

- `id`: Unique UUID identifier
- `name`: List name
- `description`: List description
- `genreId`: Associated genre ID
- `genreName`: Genre name
- `userId`: Owner's user ID
- `movies`: Array of movies in the list
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

#### `MovieListItemDto`

Individual movie in a list:

- `movieId`: TMDB movie ID
- `addedAt`: Date when added to list
- `movieDetails`: Detailed movie information (optional)

#### `MovieListSummaryDto`

Summary view for list overviews:

- `id`: List UUID
- `name`: List name
- `description`: List description
- `genreName`: Associated genre
- `movieCount`: Number of movies in list
- `createdAt`: Creation date

## Features

### List Management

- **Create Lists**: Themed movie collections by genre
- **Update Lists**: Modify name and description
- **Delete Lists**: Remove entire collections
- **Pagination**: Browse lists with pagination support

### Movie Management

- **Add Movies**: Add TMDB movies to lists
- **Remove Movies**: Remove specific movies from lists
- **Movie Details**: Optional detailed movie information
- **Timestamps**: Track when movies were added

### Authentication & Authorization

- **JWT Authentication**: All endpoints require valid JWT
- **User Isolation**: Users can only access their own lists
- **Guard Protection**: Automatic authentication validation

## Database Schema

### MovieList Entity

```sql
CREATE TABLE movie_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  genre_id INTEGER NOT NULL,
  genre_name VARCHAR NOT NULL,
  user_id VARCHAR NOT NULL,
  movies JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Movies JSON Structure

```json
[
  {
    "movieId": 550,
    "addedAt": "2023-12-15T10:30:00Z"
  }
]
```

## Integration Points

### TMDB Integration

- **Genre Validation**: Uses TMDB genre IDs and names
- **Movie References**: Stores TMDB movie IDs
- **Movie Details**: Optional enrichment with TMDB data

### User Context

- **User Identification**: Links lists to authenticated users
- **Access Control**: Ensures data isolation between users

## Error Handling

### Common Error Responses

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid JWT
- **404 Not Found**: List or movie not found
- **409 Conflict**: Duplicate movie in list

### Validation

- **DTO Validation**: Automatic input validation
- **UUID Validation**: Proper UUID format checking
- **Type Conversion**: Automatic type conversion for numbers

## Benefits

1. **User Experience**: Personalized movie collections
2. **Organization**: Genre-based categorization
3. **Flexibility**: Full CRUD operations on lists and movies
4. **Security**: Authentication-protected endpoints
5. **Performance**: Pagination for large collections
6. **Integration**: Seamless TMDB integration
7. **Documentation**: Self-documenting API with Swagger
8. **Type Safety**: Strong typing with DTOs
