# Project Context

## Purpose

E-commerce backend for selling products

## Tech Stack

- Node
- express
- express validator 7.3

## Project Conventions

### Code Style

- Use TypeScript everywhere; JavaScript files are not allowed
- Follow functional programming style; avoid class-based services unless strictly necessary
- Keep routes thin: routes must only handle HTTP wiring (method, path, middleware)
- Place business logic in handlers; routes must never contain logic
- Use clear, intention-revealing names for variables and functions
- Avoid abbreviations unless they are universally understood

### Architecture Patterns

src/
├── app.ts # Express app (Vercel entry)
│
├── config/
│ ├── env.ts # Env parsing & validation
│ ├── supabase.ts # Supabase admin client
│ └── constants.ts
│
├── middlewares/
│ ├── auth.middleware.ts # JWT verification
│ ├── role.middleware.ts # RBAC
│ ├── error.middleware.ts # Global error handler
│ └── validate.middleware.ts # Request validation
│
├── modules/ # Feature-based structure
│ ├── auth/
│ │ ├── auth.routes.ts
│ │ └── auth.handlers.ts
│ │
│ ├── users/ # Example module
│ │ ├── user.routes.ts
│ │ ├── user.handlers.ts
│ │ ├── user.repo.ts
│ │ └── user.types.ts
│ │
│ ├── products/ # Example module
│ │ ├── product.routes.ts
│ │ ├── product.handlers.ts
│ │ ├── product.repo.ts
│ │ └── product.types.ts
│ │
│ ├── orders/ # Example module
│ │ ├── order.routes.ts
│ │ ├── order.handlers.ts
│ │ ├── order.repo.ts
│ │ └── order.types.ts
│
├── utils/
│ ├── http.ts # Response helpers
│ ├── errors.ts # Custom error helpers
│ ├── pagination.ts
│ └── async.ts # asyncHandler wrapper
│
├── routes.ts # Route registry
└── vercel.json

### Testing Strategy

[Explain your testing approach and requirements]

### Git Workflow

[Describe your branching strategy and commit conventions]

## Domain Context

- The system represents the backend layer of an e-commerce platform
- It exposes RESTful endpoints consumed by a frontend application and internal tools
- User identity is managed externally through Supabase authentication
- Access permissions depend on roles associated with authenticated users
- Product, order, and transactional data require server-side verification
- Business rules may evolve as new commerce features are introduced
- Data consistency is critical for order processing and inventory management
- The backend acts as an authority layer, not a data proxy
- All external clients are considered untrusted
- The system is designed to grow by adding new feature modules

## Important Constraints

- This project is a REST-based e-commerce backend
- It is implemented using Node.js, Express, and TypeScript
- Supabase is used as the authentication provider and primary database
- Supabase Auth is the single source of truth for user identity
- JWTs issued by Supabase are used to authenticate API requests
- All incoming requests must be validated and sanitized using express-validator
- Validation must occur before business logic execution
- Use express-validator for all request validation (params, query, body)
- Validation logic must live in dedicated validator files or middleware, not inside handlers
- Always validate and sanitize user input, even for authenticated routes
- Use early returns for validation and authorization failures
- Use async/await consistently; promises with .then() are not allowed
- Wrap all async handlers using a shared async error handler to avoid try/catch duplication
- Never swallow errors; always pass errors to the global error middleware
- Use a centralized error format for all API responses
- Never hardcode secrets, API keys, or environment-specific values

## External Dependencies

[Document key external services, APIs, or systems]
