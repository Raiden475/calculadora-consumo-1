# LogiRuta — Bitácora de Consumo de Combustible

Aplicación web para registrar y calcular el consumo de combustible de vehículos durante un viaje.

## Stack tecnológico

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Node.js + Express (backend)
- MariaDB 11.8 (base de datos)

## Estructura del proyecto

calculadora-consumo-1/
├── bitacora-viaje-react/   ← Frontend React
│   ├── src/
│   │   ├── models/types.ts         ← Interfaces TypeScript
│   │   ├── utils/calculations.ts   ← Lógica de cálculo
│   │   └── App.tsx                 ← Componente principal
└── backend/                ← API REST Node.js
├── db.js               ← Conexión a MariaDB
└── server.js           ← Endpoints REST

## Cómo correr el proyecto

### Backend
```bash
cd backend
npm install
node server.js
```

### Frontend
```bash
cd bitacora-viaje-react
npm install
npm run dev
```

## Repositorio

**Autor:** Raul Camacho · ITS 2do TSDSFS 2026  
**Rama principal:** `bitacora-viaje`