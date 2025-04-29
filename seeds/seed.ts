import { createConnection } from 'typeorm';
import { Brand } from '../src/brands/entities/brand.entity';
import { Cigar } from '../src/cigars/entities/cigar.entity';

async function seed() {
  const connection = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'andrew',
    password: 'devotion-INGA-slob-punks',
    database: 'hot_leaf_stick',
    entities: ['src/**/*.entity.ts'],
    synchronize: false, // Set to false to avoid schema changes
  });

  const brandRepository = connection.getRepository(Brand);
  const cigarRepository = connection.getRepository(Cigar);

  // Add Brands
  const brands = [
    {
      name: 'Sanj Patel',
      site_url:
        'https://www.shouldismokethis.com/product-category/cigars/sanj-patel/',
    },
    { name: 'Drew Estate', site_url: 'https://drewestate.com/' },
  ];

  const savedBrands = await brandRepository.save(
    brands.map((brand) => brandRepository.create(brand)),
  );

  // Add Cigars
  const cigars = [
    { name: 'Gas Station Sushi Habano', brand: savedBrands[0] },
    { name: 'SP1014 Antra', brand: savedBrands[0] },
    { name: 'Undercrown 10', brand: savedBrands[1] },
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
