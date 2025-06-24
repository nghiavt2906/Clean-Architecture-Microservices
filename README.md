# Clean Architecture in Microservices

This project demonstrates the application of Clean Architecture principles in a microservices environment. It consists of two microservices:

1. **Product Catalog Service**: Manages product information including inventory
2. **Order Management Service**: Handles customer orders and interacts with the Product Service

## Architecture Overview

Each microservice is structured according to Robert C. Martin's Clean Architecture, consisting of concentric layers:

### Core Layers (from inner to outer)

1. **Entities Layer** (`domain/entities/`)

   - Core business objects
   - Business rules that apply to these entities
   - Independent of application-specific concerns

2. **Use Cases Layer** (`usecases/`)

   - Application-specific business rules
   - Orchestrates the flow of data to and from entities
   - Contains interfaces that define how outer layers can interact with it

3. **Interface Adapters Layer** (`adapters/`)

   - Controllers: Handle HTTP requests and transform them into use case inputs
   - Repositories: Implement data access interfaces defined in domain layer
   - Presenters: Format data from use cases into a format suitable for external presentation

4. **Frameworks & Drivers Layer** (`frameworks/`)
   - Database configurations
   - Web framework setup (Express)
   - External services integration

### Key Architectural Benefits

- **Independence of Frameworks**: The business logic doesn't depend on Express, MongoDB, or any external framework
- **Testability**: Business rules can be tested without UI, database, or external services
- **Independence of UI**: The UI can change without affecting business rules
- **Independence of Database**: The database can be swapped (e.g., MongoDB to PostgreSQL) with minimal changes
- **Independence of External Agencies**: Business rules don't know about the outside world

## Project Structure

```
clean-architecture-microservices/
├── product-service/              # Product Catalog Microservice
│   ├── src/
│   │   ├── domain/               # Entities Layer
│   │   ├── usecases/             # Use Cases Layer
│   │   ├── adapters/             # Interface Adapters Layer
│   │   ├── frameworks/           # Frameworks & Drivers Layer
│   │   ├── app.ts                # Application bootstrap
│   │   └── server.ts             # Server entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── order-service/                # Order Management Microservice
│   ├── src/
│   │   ├── domain/               # Entities Layer
│   │   ├── usecases/             # Use Cases Layer
│   │   ├── adapters/             # Interface Adapters Layer
│   │   ├── frameworks/           # Frameworks & Drivers Layer
│   │   ├── app.ts                # Application bootstrap
│   │   └── server.ts             # Server entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml            # For running both services
└── README.md                     # This file
```

## Technologies Used

- **Backend**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB
- **Communication**: REST API
- **Containerization**: Docker

## Inter-Service Communication

The Order Service communicates with the Product Service via REST API to:

1. Check product availability before creating an order
2. Update product stock when an order is created or canceled

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Docker and Docker Compose (for containerized setup)

### Running Locally

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/clean-architecture-microservices.git
   cd clean-architecture-microservices
   ```

2. Start the services using Docker Compose:

   ```
   docker-compose up -d
   ```

3. The services will be available at:
   - Product Service: http://localhost:3001
   - Order Service: http://localhost:3002

### Running Without Docker

1. Set up MongoDB (locally or using a service)

2. Start the Product Service:

   ```
   cd product-service
   npm install
   npm run dev
   ```

3. Start the Order Service:
   ```
   cd order-service
   npm install
   npm run dev
   ```

## API Endpoints

### Product Service (Port 3001)

- **POST /api/products**: Create a new product
- **GET /api/products**: Get all products
- **GET /api/products/:id**: Get a specific product
- **GET /api/products/category/:category**: Get products by category
- **PUT /api/products/:id**: Update a product
- **DELETE /api/products/:id**: Delete a product

### Order Service (Port 3002)

- **POST /api/orders**: Create a new order
- **GET /api/orders**: Get all orders
- **GET /api/orders/:id**: Get a specific order
- **GET /api/orders/customer/:customerId**: Get orders by customer
- **PATCH /api/orders/:id/status**: Update order status
- **PATCH /api/orders/:id/cancel**: Cancel an order

## Sample API Usage

### Create a Product

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone",
    "description": "Latest model smartphone",
    "price": 699.99,
    "category": "Electronics",
    "inStock": 50
  }'
```

### Create an Order

```bash
curl -X POST http://localhost:3002/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "customer123",
    "items": [
      {
        "productId": "product123",
        "productName": "Smartphone",
        "quantity": 2,
        "unitPrice": 699.99
      }
    ]
  }'
```

## Clean Architecture Benefits Demonstrated

1. **Separation of Concerns**: Each layer has a distinct responsibility
2. **Dependency Rule**: Dependencies point inward, with inner layers knowing nothing about outer layers
3. **Domain Independence**: Business rules are isolated from external concerns
4. **Testability**: Business logic can be tested without external dependencies
5. **Flexibility**: Changes to external systems have minimal impact on business rules

## Future Enhancements

1. **Authentication Service**: Implement a separate service for user authentication and authorization
2. **API Gateway**: Add an API gateway to route requests to appropriate services
3. **Event-Driven Architecture**: Replace direct REST calls with message-based communication
4. **CQRS Pattern**: Implement Command Query Responsibility Segregation for more complex scenarios

## License

MIT
