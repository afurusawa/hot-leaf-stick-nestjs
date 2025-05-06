# Hot Leaf Stick Backend

The backend service for Hot Leaf Stick, a modern web application for cigar enthusiasts. Built with NestJS and Fastify, this API provides endpoints for managing cigar collections, tracking smoking experiences, and more.

## Tech Stack

- **Framework**: NestJS with Fastify
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT-based auth
- **API Documentation**: Swagger/OpenAPI
- **Language**: TypeScript
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- pnpm (recommended) or npm

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=hot_leaf_stick

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# Server
PORT=4000
NODE_ENV=development
```

## Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run database migrations:
   ```bash
   pnpm migration:run
   ```

3. (Optional) Seed the database:
   ```bash
   pnpm seed
   ```

## Development

Start the development server:
```bash
pnpm start:dev
```

The API will be available at `http://localhost:4000/api`

## Available Scripts

- `pnpm start:dev` - Start development server with hot reload
- `pnpm build` - Build the application
- `pnpm start:prod` - Start production server
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm test:cov` - Run tests with coverage
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm migration:generate` - Generate new migrations
- `pnpm migration:run` - Run pending migrations

## API Documentation

Once the server is running, you can access the Swagger documentation at:
`http://localhost:4000/api`

## Testing

The project uses Jest for testing. Tests are organized as follows:

- Unit tests: `*.spec.ts` files
- E2E tests: `test/` directory
- Test coverage: Run `pnpm test:cov`

## Database Migrations

Generate a new migration:
```bash
pnpm migration:generate src/migrations/MigrationName
```

Run pending migrations:
```bash
pnpm migration:run
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
