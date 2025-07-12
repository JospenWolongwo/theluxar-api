import { DataSource } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Auth } from '../../auth/entities/auth.entity';
import { UserPermissionEntity } from '../../user-permission/entities/user-permission.entity';
import { cleanEntity, createEntities, logSeedCompletion } from './utils';

/**
 * Clean user-related data from database
 * @param db Database connection
 */
export async function cleanUsers(db: DataSource): Promise<void> {
  console.log('Cleaning users data...');

  // Find all users to clean up
  const emails = [
    'test@example.com',
    'admin@theluxar.com',
    'customer@theluxar.com',
  ];
  const users = await db
    .getRepository(User)
    .createQueryBuilder('user')
    .where('user.email IN (:...emails)', { emails })
    .getMany();

  const userIds = users.map((user) => user.id);

  // Clean in order to respect foreign key constraints
  // First delete user permissions that reference these users
  await cleanEntity(db, UserPermissionEntity, 'user_id IN (:...userIds)', {
    userIds,
  });

  // Then delete auth entries
  await cleanEntity(db, Auth, 'email IN (:...emails)', { emails });

  // Finally delete the users themselves
  await cleanEntity(db, User, 'email IN (:...emails)', { emails });
}

/**
 * Seed users data
 * @param db Database connection
 */
export async function seedUsers(db: DataSource): Promise<User[]> {
  console.log('Seeding users...');

  // Create users
  const users = await createEntities<User>(db, User, [
    {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    },
    {
      email: 'admin@theluxar.com',
      firstName: 'Admin',
      lastName: 'User',
    },
    {
      email: 'customer@theluxar.com',
      firstName: 'Customer',
      lastName: 'User',
    },
  ]);

  // Create auth entries
  await createEntities<Auth>(db, Auth, [
    {
      email: 'test@example.com',
      password: 'testpassword',
      active: true,
      user: users.find((u) => u.email === 'test@example.com'),
    },
    {
      email: 'admin@theluxar.com',
      password: 'adminpassword',
      active: true,
      user: users.find((u) => u.email === 'admin@theluxar.com'),
    },
    {
      email: 'customer@theluxar.com',
      password: 'customerpassword',
      active: true,
      user: users.find((u) => u.email === 'customer@theluxar.com'),
    },
  ]);

  // Create user permissions
  await createEntities<UserPermissionEntity>(db, UserPermissionEntity, [
    {
      owner: users.find((u) => u.email === 'test@example.com'),
      permissions: ['user', 'ReadUsers', 'CreateUser'],
    },
    {
      owner: users.find((u) => u.email === 'admin@theluxar.com'),
      permissions: [
        'user',
        'admin',
        'Admin',
        'ReadUsers',
        'CreateUser',
        'UpdateUser',
        'DeleteUser',
      ],
    },
    {
      owner: users.find((u) => u.email === 'customer@theluxar.com'),
      permissions: ['user', 'Customer'],
    },
  ]);

  logSeedCompletion('Users');
  return users;
}
