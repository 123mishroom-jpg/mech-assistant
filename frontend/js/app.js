const chatEl = document.getElementById("chat");
const formEl = document.getElementById("chat-form");
const questionEl = document.getElementById("question");
const submitBtn = document.getElementById("submit-btn");
const charCountEl = document.getElementById("char-count");

const MAX_LENGTH = 2000;

function updateCharCount() {
  const length = questionEl.value.length;
  charCountEl.textContent = `${length} / ${MAX_LENGTH}`;
}

function renderEmptyState() {
  chatEl.innerHTML = `
    <div class="empty-state">
      还没有对话。试试问：<br />
      “什么是莫尔圆？” 或 “齿轮传动比怎么计算？”
    </div>
  `;
}

function createMessage(role, content, options = {}) {
  const message = document.createElement("article");
  message.className = `message message-${role}`;

  const label = document.createElement("div");
  label.className = "message-label";
  label.textContent = role === "user" ? "你的问题" : "AI 回答";

  const body = document.createElement("div");
  body.className = "message-content";

  if (options.loading) {
    body.innerHTML = '<div class="loading">正在思考...</div>';
  } else if (options.error) {
    body.innerHTML = `<p class="error-text">${escapeHtml(content)}</p>`;
  } else if (role === "assistant") {
    body.innerHTML = marked.parse(content);
    renderMathInElement(body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
      throwOnError: false,
    });
  } else {
    body.textContent = content;
  }

  message.append(label, body);
  return message;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function removeEmptyState() {
  const empty = chatEl.querySelector(".empty-state");
  if (empty) {
    empty.remove();
  }
}

async function submitQuestion(question) {
  removeEmptyState();

  chatEl.appendChild(createMessage("user", question));
  const assistantMessage = createMessage("assistant", "", { loading: true });
  chatEl.appendChild(assistantMessage);
  chatEl.scrollTop = chatEl.scrollHeight;

  submitBtn.disabled = true;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const detail = data.detail || "请求失败，请稍后重试。";
      assistantMessage.replaceWith(
        createMessage("assistant", detail, { error: true })
      );
      return;
    }

    assistantMessage.replaceWith(createMessage("assistant", data.answer));
  } catch (error) {
    assistantMessage.replaceWith(
      createMessage("assistant", "网络异常，请确认后端服务已启动。", {
        error: true,
      })
    );
  } finally {
    submitBtn.disabled = false;
    chatEl.scrollTop = chatEl.scrollHeight;
  }
}

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionEl.value.trim();
  if (!question) {
    return;
  }

  questionEl.value = "";
  updateCharCount();
  await submitQuestion(question);
});

questionEl.addEventListener("input", updateCharCount);

renderEmptyState();
updateCharCount();
