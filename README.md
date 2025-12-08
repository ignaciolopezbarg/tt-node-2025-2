# API de Productos y Usuarios - Node.js

API REST para manejar **productos y usuarios** con persistencia en **archivo local (`fs`)** o **MongoDB (`mongo`)**.  
Incluye CRUD completo para productos y usuarios, y autenticación de usuarios con JWT.

---

## 🔹 Modos de persistencia

- **Archivo local (`fs`)**: Los productos se guardan en `src/data/products.json`.  
- **MongoDB (`mongo`)**: Productos y usuarios almacenados en MongoDB, con IDs generados automáticamente.  

Seleccionar modo al iniciar el servidor:  

```bash
npm run fs    # modo archivo local
npm run mongo # modo MongoDB

Endpoints principales

Productos

GET /productos → Todos los productos

GET /productos/:id → Producto por Id

POST /productos → Crear producto

PUT /productos/:id → Modificar producto

DELETE /productos/:id → Eliminar producto

Usuarios

GET /users → Todos los usuarios

GET /users/:id → Usuario por Id

POST /users/register → Registrar usuario

POST /users/login → Login

PUT /users/:id → Modificar usuario

DELETE /users/:id → Eliminar usuario

{
  "product": "Tv",
  "description": "Tv 40",
  "price": 1500,
  "stock": 12,
  "img": "imagen no disponible",
  "category": "electronica"
}

src/
├─ controllers/   # lógica de productos y usuarios
├─ routes/        # endpoints
├─ models/        # modelos Mongoose
├─ middlewares/   # JWT
├─ utils/         # helpers fs.Products.js
├─ data/          # products.json (modo fs)
└─ app.js
.env

👨‍💻 Autor

Ignacio López Barg – 2025 – Talento Tech Node.js