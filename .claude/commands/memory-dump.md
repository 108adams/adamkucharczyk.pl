---
description: "Save current context to persistent memory in cc/MEMORY/"
tools: ["Bash", "Read", "Write", "Edit", "AskUserQuestion"]
---

# Save Current Context to Persistent Memory

Dump current working context to memory files for future session continuity.

## Existing Memory Files

!`ls -la cc/MEMORY/`

## Instructions

Follow this workflow to save context:

### Step 1: Determine Action

Use AskUserQuestion tool to ask:

**Question**: "How should the context be saved?"
**Options**:
1. **"Update existing memory file"** - Append/modify existing memory file with current progress
2. **"Create new memory file"** - Start fresh memory file for new task/context

### Step 2A: Update Existing File

If user chose "Update existing":

1. **Identify the file to update**:
   - Check dates in headers of existing memory files
   - Use the most recent one OR the one loaded via `/memory` command in this session
   - If only one file exists, use that one

2. **Read current file content**

3. **Update the file**:
   - Update "Date" header with current timestamp: `(Updated: YYYY-MM-DD HH:MM)`
   - Update "Quick Context" if task scope changed
   - Add/update items in "Current Status" section:
     - Mark completed tasks with [x]
     - Add new pending tasks
     - Update next steps
   - Update "Key Files" section with any new files modified
   - Keep token-optimized format (concise, bullet points)

4. **Confirm**: Tell user which file was updated and what changed

### Step 2B: Create New File

If user chose "Create new":

1. **Ask for filename**:
   - Use AskUserQuestion: "What is the memory file name?"
   - Suggest format: `[domain].md` (e.g., `payment.md`, `admin.md`, `api.md`)
   - Name should reflect the task domain/area

2. **Create new memory file** at `cc/MEMORY/[chosen-name].md` with this structure:

```markdown
# [Domain] - Current State

**Date:** YYYY-MM-DD HH:MM

## Quick Context

[2-3 sentences: what task, why important, what's the goal]

## Key Files

- file.py:123-456 - what changed/what's critical
- other.ts:78 - critical pattern discovered

## Current Status

### ✅ Completed
- [x] Task 1 description
- [x] Task 2 description

### 🔴 Issues/Blockers
- Issue 1 description
- Issue 2 description

### 🔧 Next Steps
1. Next action 1
2. Next action 2

## Key Patterns/Decisions

- Critical pattern/gotcha discovered
- Important decision made and why

## References

- Plan: .claude/plans/xyz.md
- Analysis: cc/ANALYSIS_xyz.md
- Related docs: path/to/file.md
```

3. **Fill from current context**:
   - Extract relevant information from conversation history
   - Focus on: what was done, what's pending, key decisions, files touched
   - Keep token-optimized (concise, sacrifice grammar)

4. **Confirm**: Tell user the new file was created at `cc/MEMORY/[name].md`

### Step 3: Verification

After saving (update or create):
- Confirm file location
- Summarize what was saved
- Remind user: "Use `/memory` to reload this context in future sessions"

## Guidelines (from CLAUDE.md)

**Format rules**:
- Extreme concision, sacrifice grammar
- Bullet points, minimal prose
- Code snippets only if essential
- Focus: what YOU (Claude) need to resume work instantly
- Use file:line references for precision
- Reference other cc/ or .claude/plans/ files

**Purpose**: Enable seamless context restoration across sessions, build institutional memory.
