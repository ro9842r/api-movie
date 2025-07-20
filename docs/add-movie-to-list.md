# Movie Lists API - Add Movie to List Feature

## Overview

Esta funcionalidade permite adicionar filmes a listas de filmes existentes. O filme deve pertencer ao mesmo gênero da lista para ser adicionado.

## Endpoint

```
POST /movie-lists/:id/movies
```

### Parâmetros

- **id** (path parameter): ID da lista de filmes
- **movieId** (body): ID do filme no TMDB

### Request Body

```json
{
  "movieId": 123
}
```

### Response

Retorna a lista atualizada com o filme adicionado:

```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "name": "Action Movies",
  "description": "My favorite action movies",
  "genreId": 28,
  "genreName": "Action",
  "userId": "user-123",
  "movies": [
    {
      "movieId": 123,
      "addedAt": "2023-12-01T10:00:00.000Z"
    }
  ],
  "createdAt": "2023-12-01T09:00:00.000Z",
  "updatedAt": "2023-12-01T10:00:00.000Z"
}
```

## Validações

1. **Lista existe**: A lista deve existir e pertencer ao usuário autenticado
2. **Filme existe**: O filme deve existir na API do TMDB
3. **Gênero compatível**: O filme deve ter pelo menos um gênero que corresponda ao gênero da lista
4. **Filme único**: O filme não pode já estar na lista

## Possíveis Erros

### 404 - Not Found

```json
{
  "statusCode": 404,
  "message": "Movie list not found"
}
```

### 400 - Bad Request

```json
{
  "statusCode": 400,
  "message": "Movie does not belong to the genre \"Action\""
}
```

### 409 - Conflict

```json
{
  "statusCode": 409,
  "message": "Movie is already in this list"
}
```

## Exemplo de Uso

```bash
# Adicionar filme ID 550 (Fight Club) a uma lista de drama
curl -X POST http://localhost:3000/movie-lists/456e7890-e89b-12d3-a456-426614174001/movies \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": 550
  }'
```

## Fluxo de Validação

1. Verifica se a lista existe e pertence ao usuário
2. Busca os detalhes do filme na API TMDB
3. Verifica se o filme tem pelo menos um gênero compatível com a lista
4. Verifica se o filme já não está na lista
5. Adiciona o filme à lista com timestamp atual
6. Salva e retorna a lista atualizada
