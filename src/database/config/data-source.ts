import { DataSource } from 'typeorm';
import { typeormOptions } from './database.config';

export default new DataSource(typeormOptions);
