# DetailingMJ 🚗✨

Aplicación e-commerce de productos de detailing profesional para autos.
Stack: **React (Vite)** + **Node.js (Express)** + **MongoDB Atlas**

---

## Estructura del Proyecto

```
detailingmj/
├── client/     → Frontend React (Vite)
└── server/     → Backend Node.js (Express + Mongoose)
```

---

## Configuración Inicial

### 1. MongoDB Atlas (Base de Datos Gratuita)

1. Ir a [https://cloud.mongodb.com](https://cloud.mongodb.com) y crear cuenta gratuita
2. Crear un nuevo **cluster M0** (gratuito)
3. En **Database Access**: crear usuario con contraseña
4. En **Network Access**: agregar `0.0.0.0/0` (permite acceso desde cualquier IP)
5. En el cluster, hacer click en **Connect → Drivers** y copiar la URI que tiene este formato:
   ```
   mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/
   ```
6. Abrir `server/.env` y pegar la URI en `MONGO_URI`:
   ```env
   MONGO_URI=mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/detailingmj?retryWrites=true&w=majority
   JWT_SECRET=un_secreto_muy_largo_y_seguro_123!
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=tu_contraseña_admin
   CLIENT_URL=http://localhost:5173
   PORT=5000
   ```

### 2. Cargar Productos de Ejemplo

Con el `.env` configurado, desde la carpeta `server/`:
```bash
npm run seed
```
Esto carga 11 productos de ejemplo (shampoos, ceras, pulidoras, etc.)

---

## Correr en Local

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
→ Servidor en `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
→ App en `http://localhost:5173`

---

## Uso del Panel de Administrador

La ruta de administración es **oculta** e intencionalmente no aparece en el menú:

```
http://localhost:5173/admin-login
```

Las credenciales son las que definiste en el `.env`:
- Usuario: `ADMIN_USERNAME`
- Contraseña: `ADMIN_PASSWORD`

Desde el panel podés:
- ✅ Ver todo el inventario en una tabla
- ✅ Sumar/restar stock con botones `[+]` y `[−]`
- ✅ Agregar productos nuevos con imagen, precio y descripción
- ✅ Editar cualquier producto existente
- ✅ Eliminar productos

---

## Deploy Gratuito

### Backend → Render.com

1. Subir el código a GitHub (incluir la carpeta `server/`)
2. Ir a [https://render.com](https://render.com) y crear cuenta
3. New → **Web Service** → conectar el repositorio de GitHub
4. Configurar:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. En **Environment Variables**, agregar todas las variables del `.env` del servidor
6. Deploy → Render te dará una URL del tipo `https://detailingmj-api.onrender.com`

> ⚠️ **Nota:** El plan gratuito de Render entra en "sleep" tras 15 min de inactividad. La primera petición puede tardar ~30s en despertar.

### Frontend → Vercel.com

1. Ir a [https://vercel.com](https://vercel.com) y crear cuenta con GitHub
2. Importar el repositorio
3. Configurar:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
4. En **Environment Variables**, agregar:
   ```
   VITE_API_URL=https://detailingmj-api.onrender.com/api
   ```
   (usar la URL real de Render)
5. Deploy → Vercel te da una URL del tipo `https://detailingmj.vercel.app`

6. ⚠️ Volver a Render y actualizar `CLIENT_URL` con la URL de Vercel para el CORS.

---

## API Reference

| Método | Ruta | Descripción | Requiere Auth |
|--------|------|-------------|---------------|
| GET | `/api/products` | Listar productos (con filtros) | No |
| POST | `/api/products` | Crear producto | ✅ JWT |
| PUT | `/api/products/:id` | Editar producto | ✅ JWT |
| PATCH | `/api/products/:id/stock` | Ajustar stock (+/-) | ✅ JWT |
| DELETE | `/api/products/:id` | Eliminar producto | ✅ JWT |
| POST | `/api/auth/login` | Login administrador | No |

### Parámetros de filtro (GET /api/products)
- `?search=shampoo` — busca por nombre
- `?category=cera` — filtra por categoría
- `?inStock=true` — solo productos con stock > 0
