# Movie Carousel and Infinite Scroll Web App (Frontend & Backend)

## Description

This project is a movie browsing web application with a backend API and frontend interface. It includes:
- A carousel for showcasing movies.
- Infinite scroll functionality to dynamically load more movies.
- A modal for viewing movie details and trailers.
- A backend API for managing movie data and serving requests.

The frontend is built using React and Tailwind CSS, while the backend is developed with Node.js and Express.

## Features

### Frontend
- **Movie Carousel**: Displays a horizontal scrollable list of movies.
- **Infinite Scroll**: Dynamically loads more movies as the user scrolls down.
- **Movie Modal**: Opens a modal to display movie details and play trailers.
- **Hero Banner**: Highlights featured content with a visually appealing design.
- **Sidebar Navigation**: Includes a button for uploading new content.

### Backend
- **RESTful API**: Provides endpoints for fetching movie data.
- **Database Integration**: Stores movie details in a database (e.g., MongoDB or PostgreSQL).
- **Authentication**: Handles user authentication (if applicable).
- **Data Validation**: Ensures incoming data is properly validated.

## Dependencies

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **React Icons**: Provides icons for the UI (e.g., `FaPlay`, `FaPlus`).
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Axios**: Used for making API requests to the backend.

### Backend
- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for creating RESTful APIs.
- **Database Driver**: MongoDB (`mongoose`) or PostgreSQL (`pg`).
- **Cors**: Middleware for handling cross-origin requests.
- **Body-parser**: Middleware for parsing incoming request bodies.
- **Dotenv**: For managing environment variables.

## Installation

### Backend
1. Clone the repository:
   ```bash
   git clone <repository-url>