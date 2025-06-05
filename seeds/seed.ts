import { DataSource } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { Brand } from '../src/brands/entities/brand.entity';
import { Cigar } from '../src/cigars/entities/cigar.entity';
import { Vitola } from '../src/vitolas/entities/vitola.entity';
import { Collection } from '../src/collections/entities/collection.entity';
import * as bcrypt from 'bcryptjs';

// Adjust this config as needed or import from your data-source.ts
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'hot_leaf_stick',
  entities: [User, Brand, Cigar, Vitola, Collection],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const brandRepo = AppDataSource.getRepository(Brand);
  const cigarRepo = AppDataSource.getRepository(Cigar);
  const vitolaRepo = AppDataSource.getRepository(Vitola);
  const collectionRepo = AppDataSource.getRepository(Collection);

  // --- Seed Users ---
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = userRepo.create({
    email: 'user@example.com',
    password: passwordHash,
    name: 'Seed User',
  });
  await userRepo.save(user);

  // --- Seed Brands ---
  const brand = brandRepo.create({
    name: 'Seed Brand',
    site_url: 'https://brand.example.com',
  });
  await brandRepo.save(brand);

  // --- Seed Cigars ---
  const cigar = cigarRepo.create({
    name: 'Seed Cigar',
    brand_id: brand.id,
    brand: brand,
  });
  await cigarRepo.save(cigar);

  // --- Seed Vitolas ---
  const vitola = vitolaRepo.create({
    name: 'Seed Vitola',
    length: 5.5,
    ring_gauge: 50,
    cigar: cigar,
  });
  await vitolaRepo.save(vitola);

  // --- Seed Collections ---
  const collection = collectionRepo.create({
    user_id: user.id,
    user: user,
    cigar_id: cigar.id,
    cigar: cigar,
    vitola_id: vitola.id,
    vitola: vitola,
    quantity: 2,
    storage_date: new Date(),
  });
  await collectionRepo.save(collection);

  console.log('Seeding complete!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
