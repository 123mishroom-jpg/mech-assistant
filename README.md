# 机械工程问答助手

本地运行的机械工程专业问答网页：输入问题，通过 Python 后端调用大模型 API 返回答案。

## 环境要求

- Python 3.10+
- 已配置 `.env`（可参考 `.env.example`）

## 快速开始

1. 在项目根目录创建或确认 `.env` 文件：

```env
LLM_API_KEY=你的密钥
LLM_BASE_URL=https://api.deepseek.com/v1
LLM_MODEL=deepseek-chat
```

2. 安装依赖并启动：

```powershell
cd C:\Users\70265\Projects\mech-qa-assistant
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
```

3. 浏览器打开：<http://127.0.0.1:8000>

## 项目结构

```
mech-qa-assistant/
├── backend/          # FastAPI 后端
├── frontend/         # 静态网页
├── .env              # API 配置（本地，不提交）
└── .env.example      # 配置示例
```

## API

- `GET /api/health` — 健康检查
- `POST /api/chat` — 发送问题，请求体：`{"question": "..."}`
