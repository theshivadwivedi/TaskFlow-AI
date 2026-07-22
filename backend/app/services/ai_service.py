from datetime import date

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import settings
from app.models.task import TaskPublic


_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=settings.gemini_api_key,
    temperature=0.3,  # low temperature = more consistent, less "creative" answers — we want facts, not stories
)

_SYSTEM_INSTRUCTIONS = """You are a task-management assistant. You answer questions about
the user's tasks using ONLY the task list given to you below — never invent tasks that
aren't listed. If nothing matches the question, say clearly that no matching tasks were found.
Be concise and direct. Today's date is {today}.

The user's current tasks:
{task_context}
"""

_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", _SYSTEM_INSTRUCTIONS),
        ("human", "{question}"),
    ]
)

# The "chain": fill in the prompt -> send to Gemini -> turn the reply into plain text.
_chain = _prompt | _llm | StrOutputParser()


def _format_tasks_as_text(tasks: list[TaskPublic]) -> str:
    """Turns a list of Task objects into plain lines the LLM can actually read."""
    if not tasks:
        return "The user currently has no tasks."

    lines = []
    for task in tasks:
        due = task.due_date.strftime("%Y-%m-%d") if task.due_date else "No due date"
        category = task.category or "Uncategorized"
        lines.append(
            f"Task: {task.title} | Category: {category} | "
            f"Priority: {task.priority} | Status: {task.status} | Due: {due}"
        )
    return "\n".join(lines)


async def answer_question(question: str, tasks: list[TaskPublic]) -> str:
    task_context = _format_tasks_as_text(tasks)
    today = date.today().isoformat()

    reply = await _chain.ainvoke(
        {"question": question, "task_context": task_context, "today": today}
    )
    return reply