# GreenShop Backend Repository

This repository contains the backend code for the **GreenShop** project, an e-commerce platform for eco-friendly products. The application is built to support features like product browsing, user authentication, and order management, ensuring a seamless shopping experience for customers.

## Purpose
The primary goal of this project is to provide a robust backend service for an online store specializing in green and sustainable products. It handles data management, API endpoints, and business logic necessary for running an e-commerce platform.

## Features
- User authentication and authorization
- Product management (CRUD operations)
- Order management
- Category and tag organization for products
- Secure API endpoints

## Technologies and Packages
The project leverages the following key technologies and packages:

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Framework for building RESTful APIs.
- **Sequelize**: ORM for database management.
- **PostgreSQL**: Relational database system.
- **MongoDB**: NoSQL database for scalable data storage.
- **Redis**: In-memory data structure store for caching.
- **JWT (jsonwebtoken)**: For authentication and secure API communication.
- **bcrypt**: For password hashing.
- **dotenv**: To manage environment variables.
- **cors**: For handling Cross-Origin Resource Sharing.
- **nodemon**: Development utility for monitoring file changes.

## Installation
To set up the project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/zhalgas-seidazym/be-greenshop-final.git
   cd be-greenshop-final
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   PORT=8000
   MONGODB_URI=mongodb+srv://your_mongodb_uri
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   REDIS_DB=0
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES=3h
   ROOT_EMAIL=your_email
   ROOT_EMAIL_PASS=your_email_password
   ```

## Running the Application

1. **Run with Docker Compose**:
   Ensure `docker` and `docker-compose` are installed, then:
   ```bash
   docker-compose up
   ```
   This will spin up all necessary services (e.g., MongoDB, Redis, and the application server).

2. **Start the Server**:
   Once Docker Compose is running, start the server:
   ```bash
   npm start
   ```

3. **Development Mode**:
   To run the server with live reload during development, use:
   ```bash
   npm run dev
   ```

4. **Swagger Update**:
   If any changes are made to the API, regenerate the Swagger documentation:
   ```bash
   npm run swagger
   ```

5. **Access the API**:
   The server will be running at `http://localhost:<PORT>` (default is `8000` as specified in the `.env` file).

## Contributing
If you wish to contribute to the project:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push to your fork.
4. Open a pull request to the main repository.


## Contact
For any inquiries or support, please contact the repository owner or open an issue in the GitHub repository.
