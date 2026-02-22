# 🚀 Perth Sustainability Tracker

Track household water and energy usage with sustainability scoring and personalized tips.

🌐 **Live Website**: https://perth-sustainability.vercel.app/

## 🎬 App Demo

See the core user flow in action:

### Dashboard Overview
<video src="https://github.com/user-attachments/assets/dabebe85-fbb6-49ca-ad23-e9018be431ee" width="480" controls autoplay loop muted></video>


### Usage Input + Chart Update


https://github.com/user-attachments/assets/d8e6a824-d983-42e9-bcd3-488065325c4a

---

# 🚀 Quick Start - Development Mode

Get the Sustainability Tracker running in Docker with hot reload in under 5 minutes!

---

## ✅ Prerequisites

1. **Install Docker Desktop**
   - Mac: https://docs.docker.com/desktop/install/mac-install/
   - Windows: https://docs.docker.com/desktop/install/windows-install/
   - Linux: https://docs.docker.com/desktop/install/linux-install/

2. **Start Docker Desktop**
   - Open the Docker Desktop app
   - Wait for it to fully start (whale icon in taskbar/menu bar)

3. **Verify Docker is running**
   ```bash
   docker --version
   docker-compose --version
   ```

---

## 🎯 Run the Project (3 Steps)

### Step 1: Clone/Download the Project

```bash
cd sustainability-app
```

### Step 2: Start Development Environment Using Docker Compose directly

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Step 3: Open Your Browser

Go to: **http://localhost:3000**

🎉 **You're done!**

---

## 📋 What Just Happened?

Docker started 3 containers:

1. **PostgreSQL** (database) on port 5432
2. **Backend** (Node.js API) on port 3001
3. **Frontend** (React app) on port 3000

All with **hot reload** enabled - edit code and see changes instantly!

---

## 🛠️ Common Commands

### Start the project

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Stop the project

```bash
docker-compose -f docker-compose.dev.yml down
```

### View logs

```bash
docker-compose -f docker-compose.dev.yml logs -f
```
