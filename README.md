# Handcrafted Haven API

The Handcrafted Haven API is a RESTful web service designed for managing user accounts, products, orders, and payments in a marketplace dedicated to handcrafted items. Built with Node.js and Express.js, this API connects artisans with customers, enabling artisans to showcase and sell their unique products while providing essential functionalities like user registration, product listing, cart management, and payment processing. The API ensures secure interactions through JWT authentication and includes comprehensive endpoints for efficient CRUD operations, enhancing the overall user experience in the marketplace.

## Overview

Handcrafted Haven aims to connect talented artisans with customers by providing a platform to showcase and sell unique handcrafted products. The API supports essential functionalities such as product listing, user registration, cart management, and payment processing.

## API Endpoints

### User Endpoints

- **POST /api/v1/users/register**
  - Registers a new user account.
  - Required fields: `username`, `password`, and `email`.
  - Returns a confirmation of successful registration or an error message if registration fails.

- **POST /api/v1/users/login**
  - Authenticates a user and returns a JWT token for authorized access.
  - Required fields: `username` and `password`.

### Product Endpoints

- **GET /api/v1/products**
  - Retrieves a list of all products available in the marketplace.
  - Optional query parameters can filter products by category, price range, or artisan.

- **POST /api/v1/products**
  - Adds a new product to the marketplace.
  - Required fields: `name`, `description`, `price`, and `artisan`.
  - Only authorized users (artisans) can create products.

- **PUT /api/v1/products/:id**
  - Updates the details of a specific product.
  - Requires a valid product `id` and the fields to update (e.g., `name`, `price`).

- **DELETE /api/v1/products/:id**
  - Deletes a specified product from the marketplace.
  - Requires a valid product `id` and authorization.

### Order Endpoints

- **GET /api/v1/orders**
  - Retrieves a list of all orders placed by users.
  - Requires authorization.

- **POST /api/v1/orders**
  - Places a new order for one or more products.
  - Required fields: `userId`, `productIds`, and `quantity`.

- **PUT /api/v1/orders/:id**
  - Updates an existing order's details.
  - Requires a valid order `id` and the fields to update (e.g., `status`, `quantity`).

- **DELETE /api/v1/orders/:id**
  - Cancels an existing order.
  - Requires a valid order `id`.

### Payment Endpoints

- **GET /api/v1/payments**
  - Retrieves all payment transactions.
  - Requires authorization.

- **POST /api/v1/payments**
  - Processes a payment for an order.
  - Required fields: `orderId`, `amount`, and `paymentMethod`.

### Cart Endpoints

- **GET /api/v1/cart**
  - Retrieves the current user's shopping cart items.
  - Requires authorization.

- **POST /api/v1/cart**
  - Adds an item to the user's shopping cart.
  - Required fields: `productId` and `quantity`.

- **DELETE /api/v1/cart/:itemId**
  - Removes an item from the user's shopping cart.
  - Requires the `itemId` of the cart item to be removed.

## Authentication

The API uses JWT tokens for securing endpoints. After a successful login, include the token in the `Authorization` header of subsequent requests to access protected endpoints.

## Error Handling

The API returns error messages with appropriate HTTP status codes:
- `400 Bad Request` for invalid inputs.
- `401 Unauthorized` for missing or invalid authentication tokens.
- `404 Not Found` for non-existent resources.
- `500 Internal Server Error` for unexpected server issues.

## Setup

To run this project locally:
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install


### License

This project is licensed under the MIT License - see the [LICENSE](/docs/LICENSE) file for details.