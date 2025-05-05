# Inventory Management System

A modern, full-stack inventory management system built with React and Java Spring Boot.

## Features

- Product management (Add, Edit, Delete, View)
- Stock tracking and updates
- Category management
- Supplier management
- User authentication and authorization
- Real-time inventory updates
- Reports and analytics
- Low stock alerts

## Tech Stack

### Frontend
- React.js
- Material-UI
- Redux for state management
- Axios for API calls

### Backend
- Java Spring Boot
- Spring Security
- Spring Data JPA
- MySQL Database
- Maven for dependency management

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Java JDK 11 or higher
- Maven
- MySQL

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Project Structure

```
inventory-management/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── public/           # Static files
│
└── backend/              # Spring Boot backend application
    ├── src/
    │   ├── main/
    │   │   ├── java/    # Java source files
    │   │   └── resources/ # Configuration files
    │   └── test/        # Test files
    └── pom.xml          # Maven dependencies
```

## API Documentation

The API documentation will be available at `http://localhost:8080/swagger-ui.html` when the backend server is running.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
