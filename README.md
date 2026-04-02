# 🚀 Resume-Analyzer

An AI-powered platform for parsing, analyzing, and visualizing resume data. Built with a modern tech stack and advanced integrations to streamline recruitment and portfolio management.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)](https://openai.com/)

---

## ✨ Features

- 🤖 **AI-Powered Parsing**: Automatically extract contact information, experience, education, and skills from resumes using OpenAI.
- 📊 **Interactive Analytics**: Visualize resume data with dynamic charts and seniority breakdowns.
- 📁 **Resume Management**: List, search, and manage uploaded resumes with an intuitive interface.
- 📝 **PDF Export**: Generate professional PDF summaries of parsed resumes using `jspdf` and `html2canvas`.
- 🎨 **Modern UI**: A sleek, responsive dashboard built with Radix UI, Framer Motion, and Tailwind CSS.
- 🛠️ **Monorepo Architecture**: Cleanly separated frontend, backend, and shared libraries using `pnpm` workspaces.

---

## 🏗️ Architecture

The project is structured as a monorepo for better code sharing and maintainability:

- **`artifacts/portfolio`**: The frontend React application built with Vite and Tailwind CSS.
- **`artifacts/api-server`**: The backend Express.js server providing API endpoints.
- **`lib/`**: Shared libraries and integrations:
  - `integrations-openai-ai-server`: Server-side OpenAI integration logic.
  - `api-zod`: Shared Zod schemas for API validation.
  - `api-client-react`: Type-safe React hooks for API consumption.
  - `db`: Database schema and Drizzle ORM configuration.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [pnpm](https://pnpm.io/) (v9 or higher)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/parasagarwal7342/Resume-Analyzer.git
    cd Resume-Analyzer
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root and add the following:
    ```env
    AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_api_key
    AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
    DATABASE_URL=your_database_connection_string
    ADMIN_PASSWORD=your_admin_password
    ```

4.  **Run the development server:**
    ```bash
    pnpm run dev
    ```

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Radix UI, Framer Motion, Recharts, Wouter
- **Backend**: Node.js, Express.js, Drizzle ORM, Pino Logging
- **AI/ML**: OpenAI API (GPT models for resume extraction)
- **Validation**: Zod
- **Build Tools**: pnpm, tsc, esbuild

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

Developed with ❤️ by [Paras Agarwal](https://github.com/parasagarwal7342)
