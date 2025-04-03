# Database Setup

To set up the database properly:

1. Ensure your database URL is set in the `.env` file:
```
DATABASE_URL="your-database-url"
```

2. Run Prisma migrations to create/update database schema:
```bash
npx prisma generate
npx prisma migrate dev
```

This will ensure:
- Proper table creation with CUID generation
- Type generation for Prisma client
- Database schema synchronization

The schema uses Prisma's built-in CUID generation for IDs and handles timestamps automatically.