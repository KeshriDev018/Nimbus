Architecture

Unlike the Master,

The Worker doesn't wait for requests initially.

It behaves like this:

Read Config

↓

Initialize Services

↓

Register With Master

↓

Heartbeat Loop

↓

Wait


Phase 2 - Sprint 2: Auto Registration
Goal

When the worker starts:

Worker Starts
      │
      ▼
Reads .env
      │
      ▼
Registers itself with Master
      │
      ▼
Master stores worker
      │
      ▼
Worker prints:
✅ Registered Successfully

No manual API calls.


What you've just built is not a CRUD application anymore.

You now have two independent applications communicating over HTTP.

+------------------+           HTTP POST            +----------------------+
|  Worker Agent    | -----------------------------> | Master Server      |
|                  |                                |                    |
| Reads .env       |                                |RegistersWorker     |
| Starts           |                                |Stores ClusterState |
+------------------+                                +----------------------+

This is the first step towards a distributed system.

Worker Starts

↓

Registers

↓

Every 5 seconds

↓

Heartbeat

↓

Master updates

CPU

RAM

Last Heartbeat

↓

Worker alive


Why are we using systeminformation?
Node's built-in os module can tell us:

hostname
total memory
free memory

But it cannot reliably tell us current CPU usage %.

The systeminformation library provides:

CPU utilization
Memory utilization
Disk usage
Network info
Battery
Temperature

We'll use it throughout Nimbus.



Phase 2 - Sprint 5: Reconnection & Fault Tolerance

Right now, if the Master is down when the Worker starts, registration fails and the Worker just logs an error.

We'll make the Worker intelligent:

If Master is down → keep retrying every few seconds.
If the connection is lost later → automatically reconnect.
When the Master comes back → register again and resume heartbeats.

That's how real distributed systems handle temporary network failures and service restarts.



Current architecture:

             MASTER

      Cluster State

            ▲

Register + Heartbeat

            ▲

        Worker Agent

The Master only knows about workers.

It cannot control them.

Our Goal

We want this:

             MASTER

          "Deploy nginx"

                │

                ▼

         Worker Agent

                │

                ▼

         Docker Engine

                │

                ▼

      nginx Container Running

Notice something important:

The Master never talks to Docker.

The Worker talks to Docker.

This is exactly how Kubernetes works.



Final Phase 3 Architecture
                MASTER

                    │

        Deploy Request

                    │

                    ▼

          Worker HTTP Server

                    │

             Controller

                    │

         Deployment Service

                    │

           Docker Service

                    │

            Docker Engine

                    │

             Container Runs


Phase 4 

User
  ↓
Master /deploy
  ↓
Scheduler picks Worker
  ↓
Master sends HTTP request
  ↓
Worker runs Docker
  ↓
Worker returns containerId
  ↓
Master stores deployment