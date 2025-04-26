import { createConnection } from 'typeorm';
import { Brand } from '../src/brands/entities/brand.entity';
import { Cigar } from '../src/cigars/entities/cigar.entity';

async function seed() {
  const connection = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'test_user',
    password: 'test_password',
    database: 'test_database',
    entities: ['src/**/*.entity.ts'],
    synchronize: false, // Set to false to avoid schema changes
  });

  const brandRepository = connection.getRepository(Brand);
  const cigarRepository = connection.getRepository(Cigar);

  // Add Brands
  const brands = [
    { name: 'Test Brand 1', site_url: 'https://www.testbrand1.com' },
    { name: 'Test Brand 2', site_url: null },
  ];

  const savedBrands = await brandRepository.save(
    brands.map((brand) => brandRepository.create(brand)),
  );

  // Add Cigars
  const cigars = [
    { name: 'Test Cigar 1', brand: savedBrands[0] },
    { name: 'Test Cigar 2', brand: savedBrands[0] },
    { name: 'Test Cigar 3', brand: savedBrands[1] },
  ];

  await cigarRepository.save(
    cigars.map((cigar) => cigarRepository.create(cigar)),
  );

  console.log('Seeding completed:', savedBrands, cigars);

  await connection.close();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
