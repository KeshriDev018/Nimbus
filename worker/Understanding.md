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