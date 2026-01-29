# 🚀 AuraTechIT Quick Start Guide

## 📋 One-Click Startup

### 🎯 Start All Services
Double-click `start-all.bat` to launch the entire AuraTechIT platform:

- **API Service** (Port 3001)
- **Marketing Site** (Port 3000) 
- **Admin Panel** (Port 3002)
- **Main Dashboard** (Port 3003)

### 🛑 Stop All Services
Double-click `stop-all.bat` to stop all running services.

## 🔑 Access Information

### Demo Login
- **Email**: `demo@auratechit.com`
- **Password**: `demo123456`

### URLs
- **Marketing Website**: http://localhost:3000
- **Main Dashboard**: http://localhost:3003
- **Admin Panel**: http://localhost:3002
- **API Service**: http://localhost:3001

## 📁 Project Structure
```
AuraTechIT/
├── start-all.bat          # Start all services
├── stop-all.bat           # Stop all services  
├── services/
│   └── api/               # Backend API
├── apps/
│   ├── marketing-site/    # Public website
│   ├── admin-panel/      # Admin dashboard
│   └── dashboard/        # Main user dashboard
└── packages/
    ├── types/             # Shared types
    └── ui/                # UI components
```

## 🛠 Requirements
- Node.js 18+
- PostgreSQL (running on port 5432)
- Redis (running on port 6379)

## 🐛 Troubleshooting
1. **Port conflicts**: Services will automatically find available ports
2. **Database errors**: Ensure PostgreSQL is running
3. **Build errors**: Run `npm install` in each service directory
4. **Permission errors**: Run as Administrator if needed

## 📞 Support
Check the console windows for detailed error messages if services fail to start.
