
# Prueba Técnica Backend – Sistema de Pagos

## Requisitos

- Node.js 18+
- pnpm (o npm)
- Python 3.12+
- PostgreSQL 18+

## Backned

1. Clona el repositorio

```bash
git clone https://github.com/AnythingStore/Prueba-tecnica-backend.git
cd Prueba-tecnica-backend
```



2. Instalar Backend

```bash
cd backend
cp .env.example .env  # O copia manualmente y edita tus variables
pnpm install          # o npm install
pnpm run prisma:generate 
pnpm run prisma:migrate
```

3. Ejemplo de archivo .env para el Backend

Tu archivo `.env` en la carpeta `backend` debe tener al menos estas variables:

```env
PAYMENT_SERVICE_API="http://localhost:8080/process-payment"
DATABASE_URL="postgresql://postgres:Qwerty!1@localhost:5432/database"
```

4. Iniciar el backend

correr en produccion
```bash
pnpm run start
```

correr en desarrdeollo
```bash
pnpm run start:dev
```

El backend estará disponible en http://localhost:3000 (o el puerto que configures).

---
### Servicio de pago ficticio (Python)

1. Entra a la carpeta `python-service`:
	```bash
	cd python-service
	```
2. Crea y activa un entorno virtual:
	```powershell
	python -m venv .venv; .\.venv\Scripts\Activate.ps1
	```
3. Instala dependencias:
	```powershell
	python -m pip install -r requirements.txt
	```
4. Inicia el servicio:
	```powershell
	uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload
	```

El servicio expone el endpoint `/process-payment` y simula pagos ficticios (80% aprobados, 20% rechazados). El backend Node.js lo usará automáticamente al crear un pago.

**Notas:**
- Asegúrate de que tu base de datos PostgreSQL esté corriendo y accesible.
- El microservicio Python debe estar corriendo si vas a crear pagos.
- Puedes usar la colección de Postman incluida para probar los endpoints principales.
