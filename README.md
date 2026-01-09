# SaaS Core - Plantilla Base para Perú 🇵🇪

Sistema base multi-tenant para crear aplicaciones SaaS verticales (restaurantes, hoteles, gimnasios, bodegas, etc.)

## 🚀 Características

### Autenticación & Seguridad
- ✅ Login/Registro con JWT
- ✅ Recuperación de contraseña por email
- ✅ Verificación de email
- ✅ Políticas de contraseña fuertes (8+ chars, mayúscula, número, especial)
- ✅ Rate limiting (30 req/min global, 5/min en login)
- ✅ Helmet (headers de seguridad)
- ✅ CORS configurable

### Multi-Tenancy
- ✅ Multi-organización (cada cliente es una empresa separada)
- ✅ Roles y permisos por organización (OWNER, ADMIN, MEMBER)
- ✅ Aislamiento de datos por empresa

### Suscripciones & Pagos
- ✅ Planes: FREE, BASIC, PRO, MAX
- ✅ Integración con Culqi (pagos Perú)
- ✅ Límites por plan (usuarios, storage)
- ✅ Periodo de prueba

### Módulos de Negocio
- ✅ Dashboard con KPIs
- ✅ Inventario/Productos
- ✅ Clientes
- ✅ Proveedores
- ✅ Punto de Venta (POS)
- ✅ Transacciones financieras
- ✅ Reportes (ventas, inventario, finanzas, clientes)
- ✅ Facturación (preparado para SUNAT)

### UI/UX
- ✅ Tema oscuro/claro
- ✅ Diseño responsive
- ✅ Notificaciones en tiempo real (WebSocket)
- ✅ Lazy loading de rutas

---

## 🛠️ Tech Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Backend | NestJS + TypeScript |
| Base de Datos | PostgreSQL + TypeORM |
| Auth | JWT + bcrypt |
| Pagos | Culqi |
| Real-time | Socket.io |
| Estilos | TailwindCSS |

---

## 📦 Instalación

```bash
# Clonar
git clone https://github.com/tu-usuario/SaaS_Core.git
cd SaaS_Core

# Backend
cd backend
npm install
cp .env.example .env
# Editar .env con tus valores
npm run start:dev

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev
```

---

## 🔧 Variables de Entorno

Ver `backend/.env.example` para la lista completa.

### Mínimas para desarrollo:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=saas_core
JWT_SECRET=genera_uno_seguro_con_openssl
```

---

## 📁 Estructura de Módulos

```
backend/src/modules/
├── auth/           # Autenticación, usuarios
├── iam/            # Roles, permisos
├── organizations/  # Multi-tenancy
├── subscriptions/  # Planes, límites
├── plans/          # Catálogo de planes
├── payments/       # Culqi integration
├── dashboard/      # KPIs
├── transactions/   # Ingresos/gastos
├── notifications/  # WebSocket
├── email/          # Envío de emails
└── trash/          # Papelera (soft delete)

frontend/src/modules/
├── auth/           # Login, registro
├── iam/            # Gestión usuarios
├── organizations/  # Config empresa
├── subscriptions/  # Planes, pricing
├── inventory/      # Productos
├── clients/        # Clientes
├── suppliers/      # Proveedores
├── sales/          # POS, historial
├── reports/        # Reportes
├── billing/        # Facturación
└── audit/          # Logs de auditoría
```

---

## 🍴 Crear Versión de Nicho

```bash
# 1. Copiar el repositorio
git clone SaaS_Core SaaS_Restaurantes
cd SaaS_Restaurantes
rm -rf .git
git init

# 2. Eliminar módulos innecesarios
# Ejemplo: Proveedores no aplica para gimnasios
rm -rf backend/src/modules/suppliers
rm -rf frontend/src/modules/suppliers

# 3. Añadir módulos específicos
# → Restaurantes: Mesas, Menú, Pedidos cocina
# → Hoteles: Habitaciones, Reservas, Check-in
# → Gimnasios: Membresías, Clases, Entrenadores

# 4. Configurar .env de producción
# 5. Deploy
```

---

## 📋 Checklist Pre-Producción

- [ ] Generar JWT_SECRET seguro: `openssl rand -base64 64`
- [ ] Configurar CORS_ORIGIN con dominio
- [ ] Configurar Culqi con llaves de producción
- [ ] Configurar servicio de email (Resend/SendGrid)
- [ ] Configurar PostgreSQL de producción
- [ ] Deploy backend (Railway/Render)
- [ ] Deploy frontend (Vercel/Netlify)

---

## 📄 Licencia

Propiedad privada. No distribuir sin autorización.

---

**Versión:** 1.0.0-base  
**Última actualización:** Enero 2026
