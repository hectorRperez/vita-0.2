# Pre requirements

Node 18.* +

# Install

npm run install
cp .env.development.example .env
npm run dev

# Run migrate

npx prisma migrate dev

# Create migration

npx prisma migrate dev --name <name>