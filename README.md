# Personal Finance Manager

A modern, full-stack personal finance management application built with Next.js 15, featuring a clean and intuitive interface for managing your financial transactions.

## Features

- 💰 **Transaction Management**: Create, view, edit, and delete financial transactions
- 🌓 **Dark/Light Theme**: Full support for both dark and light modes
- 📱 **Responsive Design**: Seamless experience across desktop and mobile devices
- 🔒 **Type Safety**: Built with TypeScript for enhanced reliability
- 🚀 **Modern Stack**: Leverages Next.js 15's latest features including App Router and Server Actions
- 🎯 **Prisma ORM**: Robust database management with type-safe queries
- 🎨 **Tailwind CSS**: Modern and responsive styling
- 🧩 **Reusable Components**: Modular design with components like Modal, Form, and Dialog

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, HeadlessUI, Radix UI
- **Database**: Prisma ORM
- **State Management**: React Context
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Heroicons

## Getting Started

### Prerequisites

- Node.js (LTS version)
- pnpm package manager
- A database (the project is configured for PostgreSQL)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/fzambone/personal-finance-manager.git
cd personal-finance-manager
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up your environment variables:
   Create a `.env` file in the root directory with your database connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/finance_db"
```

4. Run database migrations:

```bash
pnpm prisma migrate dev
```

5. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
├── app/                    # Next.js 15 app directory
│   ├── (internal)/        # Protected routes
│   ├── actions/           # Server actions
│   └── types/             # TypeScript types
├── components/            # React components
│   ├── Generic/          # Reusable UI components
│   ├── Providers/        # Context providers
│   ├── Sidebar/          # Navigation components
│   └── Transactions/     # Transaction-specific components
├── lib/                   # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── services/             # Business logic and API services
└── utils/                # Helper functions
```

## Key Features Breakdown

### Transaction Management

- Full CRUD operations for financial transactions
- Real-time updates using Server Actions
- Type-safe database operations with Prisma
- Detailed transaction history and filtering

### User Interface

- Clean and modern design
- Responsive sidebar navigation
- Dark/light theme support
- Tooltips and confirmations for better UX
- Modal dialogs for forms and confirmations

### Development Features

- Type safety with TypeScript
- Modern development with ES6+ features
- Efficient development server with Turbopack
- Code organization following best practices

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
