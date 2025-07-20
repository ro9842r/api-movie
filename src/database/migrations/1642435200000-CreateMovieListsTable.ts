import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMovieListsTable1642435200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'movie_lists',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'genre_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'genre_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'movies',
            type: 'jsonb',
            default: "'[]'",
            isNullable: false,
            comment:
              'Array of movie IDs and metadata: [{"movieId": 123, "addedAt": "2024-01-01T10:00:00Z"}]',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        indices: [
          {
            name: 'IDX_movie_lists_user_id',
            columnNames: ['user_id'],
          },
          {
            name: 'IDX_movie_lists_genre_id',
            columnNames: ['genre_id'],
          },
          {
            name: 'IDX_movie_lists_created_at',
            columnNames: ['created_at'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('movie_lists');
  }
}
