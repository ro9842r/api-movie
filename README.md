# 🎬 API Movie

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A powerful movie management API built with NestJS, featuring TMDB integration and personalized movie lists.</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black" alt="Swagger" />
</p>

## 📋 Description

API Movie is a comprehensive movie management system that allows users to search for movies, create personalized movie lists, and manage their movie collections. Built with modern technologies and following best practices for scalable and maintainable code.

## ✨ Features

### 🔐 Authentication

- **JWT Authentication** with Supabase integration
- User registration and login
- Protected routes with custom decorators
- Secure session management

### 🎭 Movies Integration

- **TMDB API Integration** for comprehensive movie data
- Search movies by name or keywords
- Get popular and now-playing movies
- Discover movies with advanced filters (genre, year)
- Detailed movie information with cast, crew, and production data
- Genre management and categorization

### 📚 Movie Lists Management

- **Personalized Movie Collections** for authenticated users
- Create themed movie lists by genre
- Add/remove movies to/from lists
- Update list information (name, description)
- Paginated list browsing
- User-specific list isolation

### 📖 Documentation

- **Comprehensive Swagger Documentation** for all endpoints
- Custom decorators for clean, maintainable code
- Modular README files for each feature
- Type-safe DTOs with validation

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- TMDB API key
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/ro9842r/api-movie.git
cd api-movie

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Configuration

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=api_movie

# TMDB API
TMDB_API_KEY=your_tmdb_api_key

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# JWT
JWT_SECRET=your_jwt_secret
```

### Running the Application

```bash
# Run database migrations
npm run migration:run

# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Build for production
npm run build
```

The API will be available at `http://localhost:3000`

### 📚 API Documentation

Access the interactive Swagger documentation at: `http://localhost:3000/api`

## 🏗️ Architecture

### Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── decorators/         # Custom Swagger decorators
│   ├── dto/               # Data transfer objects
│   ├── guards/            # JWT guards
│   └── README.md          # Auth module documentation
├── modules/
│   ├── movies/            # Movies module (TMDB integration)
│   │   ├── decorators/    # Movies-specific decorators
│   │   ├── dto/          # Movies DTOs
│   │   └── README.md     # Movies module documentation
│   └── movie-lists/      # Movie lists management
│       ├── decorators/   # Lists-specific decorators
│       ├── dto/         # Lists DTOs
│       ├── entities/    # Database entities
│       └── README.md    # Lists module documentation
├── shared/               # Shared utilities and base classes
└── config/              # Application configuration
```

### Key Technologies

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Supabase
- **External API**: The Movie Database (TMDB)
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Testing**: Jest

## 🔌 API Endpoints

### Authentication (`/auth`)

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Movies (`/movies`)

- `GET /movies/search` - Search movies by name
- `GET /movies/genres` - Get all movie genres
- `GET /movies/popular` - Get popular movies
- `GET /movies/now-playing` - Get movies currently in theaters
- `GET /movies/discover` - Discover movies with filters
- `GET /movies/:id` - Get detailed movie information

### Movie Lists (`/movie-lists`) 🔒 _Requires Authentication_

- `POST /movie-lists` - Create a new movie list
- `GET /movie-lists` - Get user's movie lists (paginated)
- `GET /movie-lists/:id` - Get movies from a specific list
- `PATCH /movie-lists/:id` - Update movie list
- `DELETE /movie-lists/:id` - Delete movie list
- `POST /movie-lists/movie` - Add movie to list
- `DELETE /movie-lists/movie` - Remove movie from list

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🛠️ Development

### Database Migrations

```bash
# Create a new migration
npm run migration:create --name=YourMigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run build
```

## 🔧 Custom Decorators

The project uses custom Swagger decorators to maintain clean and readable code:

### Authentication Decorators

- `@AuthApiTags()` - Adds Authentication tag
- `@AuthRequired()` - Marks routes as requiring authentication
- `@SignInApiDocs()` - Complete login endpoint documentation

### Movies Decorators

- `@MoviesApiTags()` - Adds Movies tag
- `@SearchMoviesApiDocs()` - Search endpoint documentation
- `@GetMovieByIdApiDocs()` - Movie details documentation

### Movie Lists Decorators

- `@MovieListsApiTags()` - Adds Movie Lists tag with auth
- `@CreateListApiDocs()` - List creation documentation
- `@GetMyListsApiDocs()` - User lists with pagination

## 📋 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use custom decorators for API documentation
- Write comprehensive tests
- Update module READMEs when adding features
- Ensure proper error handling and validation

## 📄 License

This project is [MIT licensed](LICENSE).

## 🤝 Support & Contact

- Create an [Issue](../../issues) for bug reports or feature requests
- Check out the module-specific READMEs for detailed documentation:
  - [Auth Module](src/auth/README.md)
  - [Movies Module](src/modules/movies/README.md)
  - [Movie Lists Module](src/modules/movie-lists/README.md)

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [TMDB](https://www.themoviedb.org/) - The Movie Database API
- [Supabase](https://supabase.com/) - Authentication and database services
- [TypeORM](https://typeorm.io/) - Object-relational mapping
