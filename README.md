# Giver's Heaven - Backend

Welcome to the backend repository for Giver's Heaven, a comprehensive web application built to streamline the process of donating to disaster relief efforts. This repository contains the backend server code responsible for handling API requests, interacting with the database, and managing the overall functionality of the platform.

## Table of Contents

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the Server](#running-the-server)
- [Contributing](#contributing)

---

## Introduction

This backend repository serves as the core of Giver's Heaven, providing a robust and secure backend server to handle various functionalities such as user authentication, donation post management, statistics generation, and more. The server is built using Node.js, Express.js, and MongoDB for the database.

---

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens) for authentication
- bcrypt for password hashing

---

## Project Overview

The backend server is designed to provide a RESTful API that interacts with the frontend client of Giver's Heaven. It offers endpoints for managing user authentication, donation posts, statistics generation, testimonials, community wall, and other essential functionalities. The server ensures data integrity, security, and efficient communication with the client-side application.

---

## Key Features

1. **User Authentication:**

   - Register new users securely.
   - Authenticate users with JWT tokens.
   - Implement password hashing for enhanced security.

2. **Donation Post Management:**

   - Create, read, update, and delete donation posts.
   - Implement CRUD operations for donation transactions.

3. **Statistics Generation:**

   - Calculate and provide statistics on total donations.
   - Generate monthly donation totals for a given year.
   - Retrieve top donors based on total donation amounts.

4. **Testimonial Management:**

   - Create, read, update, and delete donor testimonials.
   - Allow users to post their experiences and feedback.

5. **Community Gratitude Wall:**

   - Enable users to post comments of appreciation and support.
   - Provide a platform for users to share positive messages.

6. **Secure APIs:**

   - Implement middleware for route protection and user authorization.
   - Validate input data to ensure data integrity.

---

## API Documentation

For detailed information on the available API endpoints and their usage, please refer to the [Postman API Documentation](https://documenter.getpostman.com/view/28965294/2sA2xnx9aK).

---

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/iibrahim70/givers-heaven-server
   ```

2. Navigate to the project directory:

```bash
cd givers-heaven-server
```

### Running the Server

1. Install dependencies:

```bash
pnpm i
```

2. Set up environment variables:

- Create a `.env` file in the root directory.
- Define the following variables:

```bash
PORT=5000
DATABASE_URL=your_database_connection_url
DB_Name=your_database_name
BCRYPT_SALT_ROUNDS=12
JWT_SECRET=your_jwt_secret_key
EXPIRES_IN=1d
```

3. Run the server:

```bash
pnpm start:dev
```

The server will start running at http://localhost:5000.

## Contributing

Contributions are welcome! If you have any suggestions, improvements, or new features to add, please fork the repository and submit a pull request.
