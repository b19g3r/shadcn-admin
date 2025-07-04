# Shadcn Admin Project Overview (Frontend Perspective)

This document provides a high-level overview of the `shadcn-admin` project, focusing on its frontend aspects and how it integrates with the backend, tailored for someone with a backend background.

## 1. Project Purpose

The `shadcn-admin` project is a modern, responsive administration dashboard built for managing various aspects of a system. It provides a user interface for interacting with a microservices-based backend, offering features like user management, application oversight, chat functionalities, and system settings.

## 2. Frontend Technology Stack

The frontend is built using a contemporary web development stack, primarily focused on React and its ecosystem:

*   **Framework**: [React](https://react.dev/) - A declarative, component-based JavaScript library for building user interfaces.
*   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) - A collection of reusable components built with Radix UI and Tailwind CSS. These components are highly customizable and provide a consistent, modern look and feel.
*   **Routing**: [TanStack Router](https://tanstack.com/router/latest) - A type-safe, file-based router for React applications, simplifying navigation and route management.
*   **Build Tool**: [Vite](https://vitejs.dev/) - A fast and lightweight build tool that provides a rapid development experience with features like hot module replacement (HMR).
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.
*   **State Management**: Likely uses React's built-in state management (Context API, `useState`, `useReducer`) and potentially a dedicated state management library like Zustand or Jotai, given the presence of `src/stores/authStore.ts`.

## 3. Key Frontend Features and Modules

The project is structured into various feature modules, each responsible for a specific part of the application:

*   **Authentication (`src/features/auth`)**: Handles user sign-in, sign-up, password recovery, and session management. It interacts with the backend's authentication API (e.g., `/login`, `/register`, `/logout`, `/refresh`, `/captcha`).
*   **Dashboard (`src/features/dashboard`)**: Provides an overview or summary of key system metrics and information.
*   **User Management (`src/features/users`)**: Allows administrators to manage user accounts, roles, and permissions.
*   **Applications (`src/features/apps`)**: Manages different applications integrated into the system.
*   **Chats (`src/features/chats`)**: Implements real-time communication or messaging features.
*   **Settings (`src/features/settings`)**: Provides configuration options for the application, including account, appearance, and notification settings.
*   **Tasks (`src/features/tasks`)**: Manages various tasks or workflows within the system.
*   **Error Handling (`src/features/errors`)**: Provides dedicated pages for common errors like 403 (Forbidden), 404 (Not Found), and general errors.

## 4. Backend Integration

The frontend communicates with a Java-based microservices backend. The backend architecture, as detailed in `docs/backend-architecture.md`, utilizes Spring Cloud, Nacos for service discovery and configuration, Spring Cloud Gateway for API routing, and various other components for robust service management.

Frontend interactions primarily occur via **RESTful APIs**. For instance, the authentication module consumes the APIs documented in `docs/auth module API Documentation.md`, which include endpoints for user login, registration, token refreshing, and logout.

## 5. Development Environment

*   **Package Manager**: `pnpm` is used for efficient dependency management.
*   **Development Server**: Vite provides a fast development server with hot module replacement, meaning changes to the code are reflected in the browser almost instantly without a full page reload.

In summary, `shadcn-admin` is a comprehensive admin panel built with modern frontend technologies, designed to provide a smooth and efficient user experience for managing a microservices-powered system.