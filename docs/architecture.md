# System Architecture & Data Model

## 1. High-Level Architecture

This application uses a modern monolithic architecture with a Next.js frontend and API backend, a PostgreSQL database for structured data, and a secure server-side integration for AI services.

```mermaid
graph TD
    Client[Client Browser] -->|HTTPS| NextJS[Next.js App Router]
    NextJS -->|API Routes| Auth[Authentication]
    NextJS -->|Prisma ORM| DB[(PostgreSQL Database)]
    NextJS -->|Secure Server Call| AI[OpenAI API / AI Service]
    
    subgraph Azure Practice Lab
        NextJS
        Auth
    end

  