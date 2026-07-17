<div align="center">

# Nimbus

### Distributed Container Orchestration Platform

*A lightweight Kubernetes-inspired container orchestration platform built with Node.js, TypeScript, Docker and MongoDB.*

<br>

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Container_Runtime-2496ED?style=for-the-badge&logo=docker)
![WebSocket](https://img.shields.io/badge/WebSocket-Real_Time-010101?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

</div>

---

# Overview

Nimbus is a **distributed container orchestration platform** inspired by modern orchestration systems such as **Kubernetes**, **Docker Swarm**, and **HashiCorp Nomad**.

The system manages a cluster of worker nodes capable of running Docker containers, continuously monitors cluster health, intelligently schedules workloads based on real-time resource utilization, automatically detects node failures, and self-heals the cluster by redistributing workloads to healthy workers.

Unlike traditional deployment tools that simply launch containers, Nimbus continuously observes the cluster, makes scheduling decisions, tracks deployments, and performs automatic recovery whenever failures occur.

The primary objective of this project is to understand and implement the core concepts behind modern distributed orchestration systems from scratch.

---

# Table of Contents

- [Motivation](#motivation)
- [Installation](#Installation)
- [Key Features](#key-features)
- [Major Components](#major-components)
- [Core Capabilities](#core-capabilities)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)

# Installation

## Prerequisites

Before running Nimbus, ensure the following software is installed on your system:

- Node.js (v20 or later)
- npm
- Docker Desktop / Docker Engine
- MongoDB
- Git

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/Nimbus.git
cd Nimbus
```

---

### 2. Configure Environment Variables

Create a `.env` file inside both the **master** and **worker** directories by copying the corresponding `.env.example` file.

```
master/
├── .env.example
└── .env

worker/
├── .env.example
└── .env
```

Update the values in the `.env` files according to your local environment.

### 3. Install Dependencies

Install dependencies for both applications.

```bash
cd master
npm install
```

```bash
cd ../worker
npm install
```

---

### 4. Start Required Services

Ensure both MongoDB and Docker Engine are running before starting Nimbus.

---

### 5. Start the Master

```bash
cd master
npm run dev
```

The Master will start on **http://localhost:5000**.

---

### 6. Start a Worker

Open a new terminal.

```bash
cd worker
npm run dev
```

The Worker will automatically:

- Register with the Master
- Start sending heartbeats
- Become available for deployments

---

### 7. Verify the Cluster

Once the Worker is running, verify the cluster using:

```http
GET /api/v1/workers
```

A successful response indicates that the Worker has registered correctly and is ready to accept container deployments.

---

## Project Configuration

Nimbus uses environment variables for configuration.

### Master

| Variable | Description |
|----------|-------------|
| `PORT` | Master server port |
| `MONGODB_URI` | MongoDB connection string |
| `NODE_ENV` | Runtime environment |

### Worker

| Variable | Description |
|----------|-------------|
| `WORKER_ID` | Unique Worker identifier |
| `WORKER_PORT` | Worker server port |
| `MASTER_URL` | Master server URL |
| `NODE_ENV` | Runtime environment |

# Motivation

Modern cloud platforms rarely execute workloads directly on a single machine.

Instead they rely on distributed orchestration platforms responsible for:

- Discovering compute nodes
- Monitoring node health
- Scheduling workloads
- Deploying containers
- Recovering failed workloads
- Maintaining cluster availability
- Collecting metrics
- Streaming logs
- Recording system events

Nimbus implements these concepts in a simplified but production-inspired architecture.

The project focuses on understanding **how orchestration systems actually work internally** rather than relying on existing orchestration frameworks.

---

# Key Features

## Cluster Management

- Dynamic Worker Registration
- Automatic Worker Discovery
- Worker Health Monitoring
- Periodic Heartbeat Processing
- Cluster Statistics

---

## Intelligent Scheduling

Nimbus schedules deployments using multiple worker characteristics instead of random selection.

Scheduling factors include:

- CPU Utilization
- Memory Utilization
- Worker Health
- Failure History
- Heartbeat Freshness

This allows deployments to be distributed across the healthiest available nodes.

---

## Container Orchestration

The platform communicates directly with Docker Engine through Docker APIs.

Supported operations include:

- Container Deployment
- Container Startup
- Container Shutdown
- Deployment Tracking
- Deployment Persistence

---

## Automatic Failure Recovery

Nimbus continuously monitors worker heartbeats.

Whenever a worker becomes unavailable:

- Worker is marked OFFLINE
- Associated deployments become FAILED
- Scheduler selects another healthy worker
- Containers are automatically redeployed
- Cluster returns to healthy state

This creates a self-healing orchestration platform.

---

## Observability

Nimbus continuously records operational data including:

- Cluster Events
- Worker Metrics
- Container Logs
- Deployment History

This provides visibility into the entire cluster.

---

## Persistent State

All cluster information is stored inside MongoDB.

The database maintains:

- Worker Information
- Deployments
- Metrics
- Events
- Logs

allowing cluster state to survive application restarts.

---

# Major Components

Nimbus consists of two independent applications.

## Master Node

Responsible for:

- Worker registration
- Scheduling
- Deployment orchestration
- Cluster monitoring
- Failure recovery
- Event management
- Metrics management
- Log aggregation

---

## Worker Node

Responsible for:

- Registering with Master
- Executing Docker containers
- Sending periodic heartbeats
- Reporting resource utilization
- Streaming container logs

---

# Core Capabilities

✔ Distributed Worker Management

✔ Intelligent Scheduling

✔ Docker Container Orchestration

✔ Worker Health Monitoring

✔ Automatic Failure Detection

✔ Self-Healing Recovery

✔ Cluster Event Tracking

✔ Metrics Collection

✔ Log Streaming

✔ Persistent Cluster State

---


# System Architecture

Nimbus follows a **Master–Worker architecture**, where a central Master Node is responsible for orchestration and multiple Worker Nodes are responsible for executing workloads.

The architecture separates **control plane responsibilities** from **execution responsibilities**, similar to how modern orchestration platforms such as Kubernetes operate.

---
## High-Level Architecture

```
                         +-----------------------+
                         |       Client          |
                         +-----------+-----------+
                                     |
                                     |
                              REST API Requests
                                     |
                                     v
                +--------------------------------------+
                |              MASTER NODE             |
                |--------------------------------------|
                |                                      |
                | Worker Service                       |
                | Scheduler Service                    |
                | Deployment Service                   |
                | Recovery Service                     |
                | Event Service                        |
                | Metrics Service                      |
                | Log Service                          |
                |                                      |
                +------------+-------------------------+
                             |
                  MongoDB Persistence
                             |
        ----------------------------------------------
        |                    |                       |
        |                    |                       |
        v                    v                       v

+----------------+    +----------------+    +----------------+
|   Worker-1     |    |   Worker-2     |    |   Worker-N     |
|----------------|    |----------------|    |----------------|
| Docker Engine  |    | Docker Engine  |    | Docker Engine  |
| Containers     |    | Containers     |    | Containers     |
+----------------+    +----------------+    +----------------+
```

---


> Nimbus demonstrates practical implementation of distributed systems concepts including orchestration, scheduling, fault tolerance, self-healing, Docker integration, cluster monitoring, and persistent state management.



## Architecture Overview

```
                                    Client
                                       │
                                       │ REST APIs
                                       ▼
                    ┌────────────────────────────────────┐
                    │           MASTER NODE              │
                    │────────────────────────────────────│
                    │                                    │
                    │ Worker Controller                  │
                    │ Deployment Controller              │
                    │ Event Controller                   │
                    │ Metrics Controller                 │
                    │ Log Controller                     │
                    │                                    │
                    ├────────────────────────────────────┤
                    │ Worker Service                     │
                    │ Scheduler Service                  │
                    │ Deployment Service                 │
                    │ Recovery Service                   │
                    │ Event Service                      │
                    └───────────────┬────────────────────┘
                                    │
                             MongoDB Database
                                    │
        ────────────────────────────┼────────────────────────────
                                    │
             Heartbeats             │          Deploy Requests
                                    │
          ┌──────────────┐          │         ┌──────────────┐
          │ Worker Node  │◄─────────┼────────►│ Worker Node  │
          └──────────────┘          │         └──────────────┘
                 │                  │                │
                 ▼                  │                ▼
           Docker Engine            │          Docker Engine
                 │                  │                │
                 ▼                  │                ▼
            Containers              │          Containers
```

---

## High-Level Design

Nimbus consists of two independent applications.

### 1. Master Node

The Master acts as the brain of the cluster.

Its responsibilities include:

- Maintaining cluster state
- Managing worker registration
- Tracking worker health
- Scheduling workloads
- Deploying containers
- Recovering failed deployments
- Recording events
- Collecting metrics
- Aggregating logs

The Master **never executes containers itself**.

Instead, it coordinates Worker Nodes responsible for execution.

---

### 2. Worker Node

Worker Nodes are lightweight execution agents.

Each Worker is responsible for:

- Registering with the Master
- Sending periodic heartbeats
- Reporting CPU and memory usage
- Receiving deployment requests
- Running Docker containers
- Streaming container logs

Workers remain stateless and rely on the Master for orchestration decisions.

---

## Master Components

The Master is divided into several independent services.

This separation follows the **Single Responsibility Principle**, making each service responsible for one aspect of cluster management.

---

### Worker Service

Responsible for managing the lifecycle of Worker Nodes.

Responsibilities:

- Register Workers
- Update Heartbeats
- Track CPU Usage
- Track Memory Usage
- Detect Offline Workers
- Mark Workers Online
- Maintain Cluster Statistics

This service represents the current state of the cluster.

---

### Scheduler Service

The Scheduler decides **where new workloads should run**.

Instead of selecting a Worker randomly, Nimbus calculates a score for every Worker.

The Scheduler considers:

- CPU Usage
- Memory Usage
- Worker Health
- Failure Count
- Heartbeat Freshness

The Worker with the highest score receives the deployment.

---

### Deployment Service

Responsible for container orchestration.

Responsibilities include:

- Selecting a Worker
- Sending deployment requests
- Recording deployment information
- Updating deployment status
- Handling deployment failures

Deployment Service never communicates directly with Docker.

Instead it communicates with Worker Nodes through REST APIs.

---

### Recovery Service

The Recovery Service implements Nimbus' self-healing capability.

Whenever a Worker becomes unavailable:

1. Detect Worker failure
2. Locate failed deployments
3. Ask Scheduler for another Worker
4. Redeploy affected containers
5. Update deployment records

This ensures workload availability despite Worker failures.

---

### Event Service

Maintains an audit trail of cluster activity.

Every important operation generates an event.

Examples:

- Worker Registered
- Worker Offline
- Deployment Started
- Deployment Failed
- Recovery Started
- Recovery Completed

Events allow administrators to understand cluster history.

---

## Worker Components

Each Worker is intentionally lightweight.

Responsibilities include:

### Registration

When the Worker starts:

1. Collect system information
2. Contact Master
3. Register itself
4. Become available for scheduling

---

### Heartbeat

Every few seconds the Worker sends:

- CPU Usage
- Memory Usage
- Worker ID

The Master uses these heartbeats to determine whether the Worker is alive.

---

### Docker Runtime

The Worker communicates directly with Docker Engine using Dockerode.

Supported operations:

- Create Container
- Start Container
- Stop Container
- List Containers

Workers abstract Docker operations from the Master.

---

### Log Streaming

Containers continuously produce logs.

Workers:

- Capture Docker logs
- Send them to the Master
- Broadcast them over WebSockets

This enables real-time log viewing.

---

## Database Design

Nimbus stores cluster state inside MongoDB.

Current collections include:

### Workers

Stores:

- Worker ID
- Hostname
- IP Address
- Port
- CPU Usage
- Memory Usage
- Status
- Last Heartbeat
- Failure Count

---

### Deployments

Stores:

- Deployment ID
- Worker ID
- Container ID
- Image
- Container Name
- Status
- Creation Time

---

### Events

Stores:

- Event ID
- Event Type
- Message
- Worker ID
- Deployment ID
- Timestamp

---

### Metrics

Stores:

- Worker ID
- CPU Usage
- Memory Usage
- Timestamp

Metrics are stored periodically, enabling historical analysis.

---

### Logs

Stores:

- Container ID
- Log Message
- Timestamp

Unlike metrics, logs are textual records produced by running applications.

---

## Cluster Lifecycle

```
Worker Starts
      │
      ▼
Registers With Master
      │
      ▼
Master Stores Worker
      │
      ▼
Worker Sends Heartbeats
      │
      ▼
Scheduler Uses Metrics
      │
      ▼
Deployment Requested
      │
      ▼
Scheduler Selects Worker
      │
      ▼
Worker Starts Container
      │
      ▼
Container Running
```

---

## Failure Recovery Flow

```
Heartbeat Missing
        │
        ▼
Worker Marked OFFLINE
        │
        ▼
Deployments Marked FAILED
        │
        ▼
Recovery Service Triggered
        │
        ▼
Scheduler Chooses Healthy Worker
        │
        ▼
Container Redeployed
        │
        ▼
Cluster Healthy Again
```

---

## Design Principles

Nimbus follows several software engineering principles:

- Separation of Concerns
- Single Responsibility Principle
- Service-Oriented Design
- Persistent Cluster State
- Fault Tolerance
- Self-Healing Architecture
- Event-Driven Monitoring
- Horizontal Scalability

These principles make the system modular, extensible, and easier to maintain as additional orchestration features are introduced.

# Project Structure

Nimbus is organized using a layered architecture that separates HTTP handling, business logic, persistence, and infrastructure concerns.

Each module has a clearly defined responsibility, making the project easier to understand, test, and extend.

```
Nimbus/
│
├── master/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── realtime/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── worker/
│   ├── src/
│   │   ├── config/
│   │   ├── docker/
│   │   ├── heartbeat/
│   │   ├── register/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## Master Node Directory

The Master Node is responsible for orchestration and cluster management.

---

## config/

Contains configuration files for the Master.

Responsibilities:

- Environment Variables
- MongoDB Connection
- Server Configuration
- Global Settings

Example:

```
config/
│
├── db.ts
├── env.ts
```

---

## controllers/

Controllers receive incoming HTTP requests.

They:

- Validate request input
- Call appropriate services
- Return HTTP responses

Controllers never contain business logic.

Current Controllers:

```
controllers/
│
├── worker.controller.ts
├── deployment.controller.ts
├── event.controller.ts
├── metrics.controller.ts
├── log.controller.ts
```

---

### Worker Controller

Responsible for:

- Register Worker
- Receive Heartbeats
- Return Worker List
- Return Cluster Statistics

---

### Deployment Controller

Responsible for:

- Deploy Container
- Return Deployments

---

### Metrics Controller

Responsible for:

- Worker Metrics
- Cluster Metrics

---

### Event Controller

Responsible for:

- Returning Cluster Events

---

### Log Controller

Responsible for:

- Log Ingestion
- Fetching Container Logs

---

## routes/

Routes define every REST endpoint exposed by the Master.

Example:

```
POST /workers/register

POST /workers/heartbeat

GET /workers

GET /deployments

POST /deployments

GET /events

GET /metrics

POST /logs/ingest
```

Routes remain extremely small and simply map URLs to Controllers.

---

## services/

This is the heart of Nimbus.

Almost every orchestration decision is implemented inside Services.

```
services/

WorkerService

SchedulerService

DeploymentService

RecoveryService

EventService
```

---

### Worker Service

Maintains the current state of the cluster.

Responsibilities:

- Register Workers
- Update Heartbeats
- Detect Offline Workers
- Maintain Cluster Statistics
- Store Worker Metrics

---

### Scheduler Service

Responsible for selecting the most appropriate Worker.

Uses:

- CPU Usage
- Memory Usage
- Failure Count
- Worker Health
- Heartbeat Freshness

Returns:

```
Best Worker
```

for every deployment request.

---

### Deployment Service

Responsible for workload orchestration.

Responsibilities:

- Ask Scheduler for Worker
- Send Deployment Request
- Store Deployment
- Emit Events
- Handle Deployment Failures

---

### Recovery Service

Responsible for cluster self-healing.

Responsibilities:

- Detect failed deployments
- Find healthy Worker
- Redeploy failed containers
- Update deployment records

---

### Event Service

Maintains cluster history.

Every important operation emits an event.

Examples:

```
Worker Registered

Worker Offline

Deployment Started

Deployment Failed

Recovery Started
```

---

## models/

Contains every MongoDB model used by Nimbus.

```
models/

worker.model.ts

deployment.model.ts

event.model.ts

metrics.model.ts

log.model.ts
```

---

## Worker Model

Stores:

- Worker Identity
- Network Information
- Health Status
- Resource Usage
- Failure Count

---

## Deployment Model

Stores:

- Deployment ID
- Worker
- Docker Container
- Image
- Status
- Creation Time

---

## Event Model

Stores every significant cluster event.

Useful for:

- Audit Trail
- Debugging
- Monitoring

---

## Metrics Model

Stores periodic Worker resource snapshots.

Used for:

- Performance Monitoring
- Historical Analysis
- Scheduling Decisions

---

## Log Model

Stores Docker container logs.

Provides:

- Historical Logs
- Debugging Information
- Live Log Streaming Support

---

## realtime/

Contains WebSocket functionality.

Current responsibility:

```
Live Container Log Streaming
```

Instead of polling REST APIs repeatedly, connected clients receive logs instantly.

---

## middleware/

Contains reusable middleware.

Examples:

- Error Handling
- Authentication (Future)
- Request Validation
- Rate Limiting (Future)

---

## utils/

Utility functions shared across the project.

Examples:

- System Information
- Helper Functions
- Formatting Utilities

---

## types/

Contains TypeScript interfaces shared across the application.

Current interfaces include:

```
Worker

Deployment

ClusterEvent
```

Using centralized interfaces improves:

- Type Safety
- Maintainability
- Developer Experience

---

## Worker Node Structure

Unlike the Master, Worker Nodes remain intentionally lightweight.

```
worker/

config/

docker/

heartbeat/

register/

routes/

utils/
```

---

## docker/

Responsible for communicating directly with Docker Engine.

Supports:

- Create Container
- Start Container
- Stop Container
- List Containers

The Master never communicates directly with Docker.

Instead:

```
Master
    │
REST API
    │
Worker
    │
Docker API
    │
Docker Engine
```

---

## register/

Registers the Worker with the Master during startup.

Sends:

- Worker ID
- Hostname
- IP Address
- Port

After registration the Worker becomes available for scheduling.

---

## heartbeat/

Continuously reports Worker health.

Every heartbeat includes:

- Worker ID
- CPU Usage
- Memory Usage

The Master uses this information for:

- Health Monitoring
- Scheduling
- Failure Detection

---

## utils/

Provides Worker helper utilities.

Examples:

- CPU Usage
- Memory Usage
- Hostname
- Local IP Address

---

## Layered Architecture

Nimbus follows a classic layered backend architecture.

```
                REST API

                   │

                   ▼

             Controllers

                   │

                   ▼

              Services

                   │

                   ▼

               Models

                   │

                   ▼

              MongoDB
```

Each layer has a single responsibility.

Controllers never perform scheduling.

Services never return HTTP responses.

Models never contain orchestration logic.

This separation keeps the codebase modular, maintainable, and scalable.

---

## Why This Structure?

The project structure was designed to mimic production-grade backend systems.

Benefits include:

- Clear separation of responsibilities
- Easy feature expansion
- Better testability
- Improved maintainability
- Reusable business logic
- Scalable architecture
- Clean service boundaries
- Strong TypeScript support

As Nimbus grows with authentication, dashboard support, production hardening, and advanced scheduling strategies, this architecture allows new features to be integrated with minimal changes to existing code.