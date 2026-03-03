# 🌱 Perth Sustainability Tracker

> Track household water and energy usage with sustainability scoring and personalized tips.

🌐 **Live Website**: [perth-sustainability.vercel.app](https://perth-sustainability.vercel.app/)

---

## 🎬 App Demo

| Dashboard Overview | Usage Input + Chart Update |
| ------------------ | -------------------------- |
| <img src="docs/assets/dashboard-demo_resized.gif" width="380" alt="Dashboard demo"> | <img src="docs/assets/usageChartAndInput-demo_resized.gif" width="380" alt="Usage chart and input demo"> |

---

## 🚀 Quick Start — Development Mode

Get the Sustainability Tracker running in Docker with hot reload in under 5 minutes.

---

## ✅ Prerequisites

1. **Install Docker Desktop**
   - Mac: [docs.docker.com](https://docs.docker.com/desktop/install/mac-install/)
   - Windows: [docs.docker.com](https://docs.docker.com/desktop/install/windows-install/)
   - Linux: [docs.docker.com](https://docs.docker.com/desktop/install/linux-install/)

2. **Start Docker Desktop**
   Open the app and wait for it to fully start (whale icon in taskbar/menu bar).

3. **Verify Docker is running**
```bash
   docker --version
   docker-compose --version
```

---

## 🎯 Run the Project

### Step 1 — Clone the Project
```bash
cd sustainability-app
```

### Step 2 — Start the Development Environment
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Step 3 — Open Your Browser

Navigate to **http://localhost:3000**

🎉 That's it — you're up and running!

---

## 📋 What's Running?

Three containers start automatically:

| Container | Technology | Port |
| --------- | ---------- | ---- |
| Database  | PostgreSQL | 5432 |
| Backend   | Node.js API | 3001 |
| Frontend  | React | 3000 |

All containers have **hot reload** enabled — edit your code and see changes instantly.

---

## 🛠️ Common Commands

| Action | Command |
| ------ | ------- |
| Start | `docker-compose -f docker-compose.dev.yml up -d` |
| Stop | `docker-compose -f docker-compose.dev.yml down` |
| Logs | `docker-compose -f docker-compose.dev.yml logs -f` |

---

## 👥 Contributors

| Name | Role |
| ---- | ---- |
| Michel M. Nzikou | DMN SOLUTIONS · DevHub CoLab Program Lead |
| Nadiia Syvakivska | Consultant Developer |

For more details, visit our blog: https://nadiia-dev.vercel.app  

*Project developed Jan–Feb 2026 at Armadale Public Library, WA, Australia.*
