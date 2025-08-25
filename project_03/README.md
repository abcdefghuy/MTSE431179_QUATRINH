# Project 03 - TypeScript Express Application

## Description
This is a TypeScript-based Express.js application with Sequelize ORM for database operations and EJS templating.

## Features
- TypeScript for type safety
- Express.js web framework
- Sequelize ORM with MySQL/MariaDB
- EJS templating engine
- CRUD operations for User management
- Environment variable configuration

## Prerequisites
- Node.js (v14 or higher)
- MySQL/MariaDB database
- npm or yarn package manager

## Installation

1. Clone the repository
2. Navigate to project directory:
   ```bash
   cd project_03
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```

5. Configure your database settings in `.env` file:
   ```env
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_HOST=127.0.0.1
   DB_DIALECT=mysql
   DB_NAME_DEV=database_development
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run build` - Compile TypeScript to JavaScript
- `npm run prod` - Run compiled JavaScript in production

## Project Structure

```
src/
├── config/          # Configuration files
│   ├── config.ts    # Database configuration
│   ├── configdb.ts  # Database connection
│   └── viewEngine.ts # EJS view engine setup
├── controller/      # Route controllers
│   └── homeController.ts
├── models/          # Sequelize models
│   ├── index.ts     # Models index
│   └── user.ts      # User model
├── migrations/      # Database migrations
│   └── migration-create-user.ts
├── route/           # Route definitions
│   └── web.ts       # Web routes
├── services/        # Business logic
│   └── CRUDService.ts # CRUD operations
├── views/           # EJS templates
│   ├── crud.ejs
│   └── users/
└── server.ts        # Main application file
```

## API Endpoints

- `GET /` - Welcome page
- `GET /home` - Home page
- `GET /about` - About page
- `GET /crud` - CRUD form page
- `POST /post-crud` - Create new user
- `GET /get-crud` - Get all users
- `GET /edit-crud?id=:id` - Edit user form
- `POST /put-crud` - Update user
- `GET /delete-crud?id=:id` - Delete user

## Database Migration

Run database migration to create tables:
```bash
npm run sequelize db:migrate
```

## Technologies Used

- TypeScript
- Express.js
- Sequelize ORM
- EJS Template Engine
- bcryptjs for password hashing
- dotenv for environment variables
- nodemon for development

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
