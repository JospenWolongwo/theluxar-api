import { DataSource, DeepPartial } from 'typeorm';
import { AppDataSource } from './db';

/**
 * Initialize a database connection
 * @param entities Optional array of entity classes to register with TypeORM
 * @returns Promise with database connection
 */
export async function initDb(entities?: any[]): Promise<DataSource> {
  try {
    // If entities are provided, create a custom data source with them
    if (entities && entities.length > 0) {
      console.log(`Initializing database with ${entities.length} explicitly provided entities`);
      // Get the current options from AppDataSource
      const options = AppDataSource.options;
      
      // Create a new data source with the provided entities
      const customDataSource = new DataSource({
        ...options,
        entities: entities
      });
      
      return await customDataSource.initialize();
    }
    
    // Otherwise use the default AppDataSource
    return await AppDataSource.initialize();
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * Clean specific entities from the database
 * @param db Database connection
 * @param entityClass Entity class to clean
 * @param condition Where condition
 * @param params Parameters for where condition
 */
export async function cleanEntity(
  db: DataSource,
  entityClass: any,
  condition: string,
  params: Record<string, any>,
): Promise<void> {
  try {
    const repo = db.getRepository(entityClass);
    await repo
      .createQueryBuilder()
      .delete()
      .from(entityClass)
      .where(condition, params)
      .execute();
  } catch (error) {
    console.error(`Error cleaning ${entityClass.name}:`, error);
    throw error;
  }
}

/**
 * Clean multiple entities from the database
 * @param db Database connection
 * @param entityCleanupSpecs Array of entity cleanup specifications
 */
export async function cleanEntities(
  db: DataSource,
  entityCleanupSpecs: Array<{
    entityClass: any;
    condition: string;
    params: Record<string, any>;
  }>,
): Promise<void> {
  for (const spec of entityCleanupSpecs) {
    await cleanEntity(db, spec.entityClass, spec.condition, spec.params);
  }
}

/**
 * Save entities to the database
 * @param db Database connection
 * @param entityClass Entity class to save
 * @param entities Array of entities to save
 * @returns Array of saved entities
 */
export async function saveEntities<T>(
  db: DataSource,
  entityClass: any,
  entities: T[],
): Promise<T[]> {
  try {
    const repo = db.getRepository(entityClass);
    return await repo.save(entities);
  } catch (error) {
    console.error(`Error saving ${entityClass.name}:`, error);
    throw error;
  }
}

/**
 * Create entities in the database
 * @param db Database connection
 * @param entityClass Entity class to create
 * @param data Array of entity data
 * @returns Array of created entities
 */
export async function createEntities<T>(
  db: DataSource,
  entityClass: { new (): T },
  data: DeepPartial<T>[],
): Promise<T[]> {
  try {
    const repo = db.getRepository(entityClass);
    const entities = repo.create(data) as T[];
    return await repo.save(entities);
  } catch (error) {
    console.error(`Error creating ${entityClass.name}:`, error);
    throw error;
  }
}

/**
 * Log the completion of seed operation
 * @param entityName Name of the entity
 */
export function logSeedCompletion(entityName: string): void {
  console.log(`✅ ${entityName} seeded successfully!`);
}
