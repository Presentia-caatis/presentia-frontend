# Presentia Frontend

## Overview
Presentia Frontend is a modular web application built with React, TypeScript, and Vite. It is designed to interact seamlessly with the Presentia REST API, offering an efficient and dynamic user experience for managing attendance systems across multiple schools. This frontend is developed to be fast, maintainable, and responsive using PrimeReact and PrimeFlex for UI components and layouts.

---

## Prerequisites
Ensure you have the following installed on your system before proceeding:

- **Node.js**: v16.20.2+
- **npm**: v8.19.4+

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Presentia-caatis/presentia-frontend
   cd presentia-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Development

To start the development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173` by default.

---

## Build

To create a production-ready build:
```bash
npm run build
```
The built files will be located in the `dist` directory.

---

## Folder Structure

```plaintext
presentia-frontend/
├── .github/              # GitHub-specific configuration files
├── cypress/              # End-to-end testing configuration and support files
│   ├── fixtures/         # Sample data for tests
│   ├── support/          # Custom Cypress commands
├── node_modules/         # Dependencies
├── public/               # Static assets
│   └── vite.svg          # Example asset
├── src/                  # Application source code
│   ├── assets/           # Static assets for the application
│   ├── components/       # Reusable UI components
│   │   ├── admin/        # Components specific to admin
│   │   ├── client/       # Components specific to clients
│   │   ├── public/       # Public-facing components
│   │   └── school/       # Components specific to schools
│   ├── context/          # React context providers
│   │   ├── LayoutConfigContext.tsx
│   │   ├── ToastContext.tsx
│   │   └── UserContext.tsx
│   ├── layout/           # Layout components
│   │   ├── AdminLayout.tsx
│   │   ├── ClientLayout.tsx
│   │   ├── PublicLayout.tsx
│   │   └── SchoolLayout.tsx
│   ├── pages/            # Page components
│   │   ├── admin/        # Pages for admin
│   │   ├── auth/         # Authentication pages
│   │   ├── client/       # Pages for clients
│   │   ├── public/       # Public-facing pages
│   │   ├── school/       # Pages for schools
│   │   └── NotFoundPage.tsx
│   ├── services/         # API service functions
│   ├── style/            # Global and modular styles
│   ├── themes/           # Theme configuration
│   ├── utils/            # Utility functions
│   ├── main.tsx          # Application entry point
│   └── routes.tsx        # Application routes
├── .env                  # Environment configuration
├── vite.config.ts        # Vite configuration file
├── package.json          # Project metadata and dependencies
└── README.md             # Project documentation
```

---

## Technologies Used
- **React**: Frontend library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript for enhanced developer experience.
- **Vite**: Fast and modern build tool for web projects.
- **PrimeReact & PrimeFlex**: UI component library and CSS utilities for responsive design.

---

## Contact
For any questions or support, please contact:
- **Email**: zakybukan@gmail.com

---

