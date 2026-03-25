# Sentinel

**Physical key management system with audit trails and role-based access.**

Built as a modern rebuild of a system originally deployed at RNZAF Whenuapai Air Base — where it replaced a paper-based key register and ran in production tracking 150+ keys across an Avionics Squadron, enforcing dual-officer verification on every transaction and maintaining tamper-evident audit logs.

Sentinel is designed to be used by any organisation managing physical keys or assets — military units, facilities teams, schools, property managers.

---

## Features

- 🗝️ Visual key status dashboard — grid view, available/issued at a glance
- 👤 Personnel management with per-person key authorisations
- ✅ Issue/return workflow with officer verification
- 📋 Full audit log — searchable, filterable, exportable
- 🔐 Role-based access (Standard / Security Officer)
- 🐳 Docker Compose for easy local deployment

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Auth | JWT |
| Containerisation | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## Getting Started

```bash
# Clone and install
git clone https://github.com/tonkatommy/Sentinel
cd Sentinel

# Start everything with Docker
docker compose up --build
```

App will be available at `http://localhost:3000`

---

## Project Structure

```
sentinel/
├── client/          # React frontend
│   └── src/
├── server/          # Node/Express API
│   └── src/
├── docker-compose.yml
└── README.md
```

---

## Status

🚧 **Active development** — rebuilding from original Java desktop app.
