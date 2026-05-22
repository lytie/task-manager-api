import { join } from 'path';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'task_manager',
  entities: [join(__dirname, '..', '..', '**', '*.entity.{js,ts}')],
  subscribers: [join(__dirname, '..', '..', '**', '*.subscriber.{js,ts}')],
  migrations: [join(__dirname, '..', '..', 'database', 'migrations', '/*.{js,ts}')],
  migrationsTableName: 'migrations', // Mặc định 'migrations'
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: process.env.NODE_ENV === 'production' ? false : true,
});

dataSource.initialize()
export default dataSource