# Payment Processor (Python - FastAPI)

Small FastAPI service that simulates payment processing. The Node.js API will call this service when creating a payment.

Endpoints

- POST /process-payment
  - Payload: { "amount": float, "currency": string, "user_id": int, "card_id": int }
  - Response: { "approved": bool, "reason": "approved" | "declined" }
  - Approval probability: 80% approved, 20% declined

- GET /health
  - Response: { "status": "ok" }

Run locally

1. Create a virtual environment (recommended):

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

3. Run the service with uvicorn:

```powershell
uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload
```

Example request

```json
POST http://127.0.0.1:8080/process-payment
Content-Type: application/json

{
  "amount": 49.99,
  "currency": "USD",
  "user_id": 1,
  "card_id": 2
}
```

The service will respond with approved or declined according to the configured probability.

Integration note

- When you implement the Node.js API, call this service's `/process-payment` endpoint synchronously when creating a payment record. Use the response to set payment status in your database.
