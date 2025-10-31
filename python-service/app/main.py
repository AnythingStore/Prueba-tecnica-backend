from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from random import random
from typing import Literal
import time

app = FastAPI(title="Payment Processor", version="0.1.0")

class PaymentRequest(BaseModel):
    amount: float = Field(..., gt=0, description="Payment amount in USD")
    currency: str = Field("USD", description="Currency code")
    user_id: int = Field(..., description="ID of the user making the payment")
    card_id: int = Field(..., description="ID of the card used for the payment")

class PaymentResponse(BaseModel):
    approved: bool
    reason: Literal["approved" , "declined"]
    approved_at: float | None = None

@app.post("/process-payment", response_model=PaymentResponse)
async def process_payment(req: PaymentRequest):
    """
    Simulate payment processing.
    Approval probability: 80% approved, 20% declined.
    """
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than 0")

    # Random decision: approve if random() < 0.8
    approved = random() < 0.8
    return PaymentResponse(approved=approved, reason="approved" if approved else "declined", approved_at=int(time.time()))

@app.get("/health")
async def health():
    return {"status": "ok"}
