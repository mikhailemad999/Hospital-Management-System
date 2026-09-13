import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SeedService } from './seed.service';

async function runSeed() {
  console.log('Bootstrapping NestJS application context for database seeding...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(SeedService);
  try {
    console.log('Running enterprise hospital database seeder...');
    await seeder.seed();
    console.log('Database seeding process finished successfully.');
  } catch (error) {
    console.error('Error occurred while seeding database:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runSeed();
