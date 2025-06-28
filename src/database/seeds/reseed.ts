import { AppDataSource } from './db';
import { Auth } from '../../auth/entities/auth.entity';
import { User } from '../../user/entities/user.entity';
import { UserPermissionEntity } from '../../user-permission/entities/user-permission.entity';
import { config } from 'dotenv';

// Load environment variables
config();

async function clean() {
  const dataSource = AppDataSource.initialize();

  try {
    // Initialize the data source
    const db = await dataSource;

    // Get repositories
    const authRepo = db.getRepository(Auth);
    const userRepo = db.getRepository(User);
    const userPermissionRepo = db.getRepository(UserPermissionEntity);

    // Delete auth entry first
    await authRepo
      .createQueryBuilder()
      .delete()
      .from(Auth)
      .where('email = :email', { email: 'test@example.com' })
      .execute();

    // Then delete the user
    await userRepo
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('email = :email', { email: 'test@example.com' })
      .execute();

    // Delete user permissions
    await userPermissionRepo
      .createQueryBuilder()
      .delete()
      .from(UserPermissionEntity)
      .where('user_id IN (SELECT id FROM users WHERE email = :email)', {
        email: 'test@example.com',
      })
      .execute();

    console.log('Test user and permissions cleaned successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  } finally {
    (await dataSource).destroy();
  }
}

async function seed() {
  const dataSource = AppDataSource.initialize();

  try {
    // Initialize the data source
    const db = await dataSource;

    // Get repositories
    const authRepo = db.getRepository(Auth);
    const userRepo = db.getRepository(User);
    const userPermissionRepo = db.getRepository(UserPermissionEntity);

    // Create user
    const user = userRepo.create({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    });
    await userRepo.save(user);

    // Create auth - let the entity handle password hashing
    const auth = authRepo.create({
      email: user.email,
      password: 'testpassword',
      active: true,
      user,
    });
    await authRepo.save(auth);

    // Create user permissions
    const userPermissions = userPermissionRepo.create({
      owner: user, // Associate with the user
      permissions: ['ReadUsers', 'CreateUser'], // Add default permissions
    });
    await userPermissionRepo.save(userPermissions);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    (await dataSource).destroy();
  }
}

async function bootstrap() {
  try {
    await clean();
    // Add a small delay to ensure the clean operation is fully complete
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await seed();
    process.exit(0);
  } catch (error) {
    console.error('Bootstrap failed:', error);
    process.exit(1);
  }
}

bootstrap();
