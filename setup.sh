#!/bin/bash

echo "🚀 Setting up Datum Empire..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install API dependencies
echo "📦 Installing API dependencies..."
cd packages/api
npm install
cd ../..

# Install Web dependencies
echo "📦 Installing Web dependencies..."
cd packages/web
npm install
cd ../..

# Copy environment files
echo "📝 Setting up environment files..."
cp packages/api/.env.example packages/api/.env
cp packages/web/.env.example packages/web/.env

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update the .env files with your actual values"
echo "2. Start the database: docker-compose up postgres redis -d"
echo "3. Set up the database: npm run db:generate && npm run db:push && npm run db:seed"
echo "4. Start the development servers: npm run dev"
echo ""
echo "🌐 API will be available at: http://localhost:3000"
echo "🌐 Web app will be available at: http://localhost:5173"
echo "📚 API docs will be available at: http://localhost:3000/api"