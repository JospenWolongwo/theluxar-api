import { DataSource, DataSourceOptions } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { User } from '../../user/entities/user.entity';
import { UserPermissionEntity } from '../../user-permission/entities/user-permission.entity';
import { config } from 'dotenv';
// Load environment variables
config();

// Create database config
const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'default_user',
  password: process.env.DB_PASSWORD || 'default_password',
  database: process.env.DB_NAME || 'hello_identity',
  synchronize: true,
  entities: [Auth, User, UserPermissionEntity],
};

// Create a new data source
export const AppDataSource = new DataSource(dbConfig);
