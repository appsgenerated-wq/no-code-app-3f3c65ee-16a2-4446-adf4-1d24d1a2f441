# Lunar Primate Research App

This application is a scientific logging platform for researchers observing monkeys on the moon, inspired by Isaac Newton's principles of gravity.

## Features

- **User Authentication**: Secure login for researchers and lead scientists.
- **Project Management**: Lead Scientists can create and manage research projects.
- **Observation Logging**: Researchers can log observations with detailed notes, gravity readings, and photos.
- **Role-Based UI**: The user interface adapts based on user roles (e.g., only Lead Scientists can create projects).
- **Dynamic Forms**: Feature-rich forms for image uploads, choice selection, and relationship picking.
- **Admin Panel**: A complete backend admin interface for data management.

## Getting Started

1.  **Install Dependencies**: `npm install`
2.  **Run the App**: `npm run dev`
3.  The application will be available at `http://localhost:5173`.
4.  The Manifest backend and admin panel will be running at the URL provided during deployment.

## Demo Credentials

- **Researcher**: `researcher@manifest.build` / `password`
- **Admin**: Access the admin panel at `${config.BACKEND_URL}/admin` with `admin@manifest.build` / `admin`.
