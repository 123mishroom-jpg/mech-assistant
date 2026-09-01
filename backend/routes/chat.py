from pydantic import BaseModel, Field

from backend.config import MAX_QUESTION_LENGTH
from backend.services.llm_service import LLMServiceError, ask_llm
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api", tags=["chat"])


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=MAX_QUESTION_LENGTH)


class ChatResponse(BaseModel):
    answer: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    question = request.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="问题不能为空。")

    try:
        answer = await ask_llm(question)
    except LLMServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc

    return ChatResponse(answer=answer)
