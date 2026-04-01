# 🏗️ Social Network Backend Blueprint (Monolith + Event Driven)

## 🧠 Architecture Overview

A scalable monolith with event-driven background processing.

### Layers

- API Layer → handles HTTP requests
- Service Layer → business logic
- Event Layer → async jobs
- Worker Layer → background processing

---

## 📁 Project Structure

src/
api/ # controllers
services/ # business logic
db/ # Prisma client
events/
queue.ts # BullMQ queue
handlers/ # event processors
workers/ # background worker
utils/

---

## 🧠 Design Philosophy

### Source of truth (DB tables)

- User
- Post
- Like
- Follow

### Derived data (cached / eventual consistency)

- UserStats
- PostStats

---

## 🧾 Prisma Schema (Core Models)

### User

- profile data
- relations
- stats (1:1 required in logic)

### UserStats

- postCount
- followerCount
- followingCount
- likesGiven
- likesReceived

### Post

- author relation
- content

### Like

- user ↔ post
- unique constraint (no duplicate likes)

### Follow

- follower ↔ following
- composite primary key

### AuthProvider

- OAuth / local auth support

---

## ⚡ Event System (BullMQ)

### Queue Setup

Uses Redis + BullMQ for async processing.

---

### Emit Event (API Layer)

Flow:

1. Write to DB (truth)
2. Add job to queue

Example:

- post_liked event
- user_followed event

---

## ⚙️ Worker Layer

Processes events like:

### post_liked

- increment PostStats.likeCount
- update UserStats.likesGiven
- update UserStats.likesReceived

---

## 🧠 Core Rules

### ✔ Always:

- Write truth first (DB insert)
- Then emit event
- Never rely on stats for correctness

### ⚡ Stats:

- cached values
- eventually consistent
- optimized for fast reads

---

## 🚀 What You Built

A scalable architecture similar to:

- Instagram-style backend
- Twitter-style feed systems
- Event-driven social graph

---

## 🔥 Next Possible Upgrades

- Redis caching layer
- Feed ranking system
- Notification system
- Comments + threads
- Media uploads (S3)
- Authentication (JWT/session)
