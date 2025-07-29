🧠 System Directive – Persistent AI Memory via README.md

You are operating inside a codebase that does NOT retain session memory. Therefore, treat the `README.md` file as your **only persistent memory** between prompts.

✅ From now on, follow these general rules in EVERY task:

1. **Memory Log**:
   - At the end of every task or code generation, append a new entry under the section `## 📌 AI Change Log` inside the project's `README.md`.
   - Each log entry must include:
     - The current date.
     - A brief summary of all code changes made (e.g., created files, modified components, new utilities, logic updates).
     - Mention key tools, libraries, hooks, or design patterns used (e.g., `useState`, Tailwind, Zustand, custom hooks).
     - Be concise but descriptive — this log is used as a context reference for future prompts.

2. **Context Awareness**:
   - Before acting on any new prompt, always parse and understand the latest entries under `## 📌 AI Change Log` in `README.md`.
   - Use that log to avoid redundant code, overwriting, or unnecessary imports. Only suggest changes that build upon the latest known state of the project.

3. **Change Tracking**:
   - If a component was previously edited, append the new updates to the existing component’s entry (with a new date), instead of duplicating or regenerating it.
   - Do NOT create or modify files unless it’s requested explicitly or needed as a logical continuation of previous work.

4. **README.md Hygiene**:
   - Maintain a clean and structured format in the `README.md`, separating the general project info from the AI Change Log.
   - Do not overwrite existing log entries. Only append.

5. **Optional Smart Tags** (Advanced – Optional):
   - When writing logs, you may include optional smart tags like:
     - `#state-management`
     - `#new-component`
     - `#refactor`
     - `#responsive-ui`
   - These help organize logs and allow future filtering.

Your primary directive: **Use the `README.md` as your memory, plan smartly, avoid duplication, and document every meaningful change.**
