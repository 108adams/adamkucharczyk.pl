---
description: "Load persistent memory context from cc/MEMORY/"
tools: ["Bash", "Read", "AskUserQuestion"]
---

# Load Persistent Memory Context

Load context from persistent memory files to resume previous work.

## Memory Files Available

!`ls cc/MEMORY/`

## Instructions

Based on the memory files listed above:

1. **Count the files**:
   - If **exactly 1 file** exists: Read it immediately and present the contents
   - If **multiple files** exist: Use AskUserQuestion tool to ask which file to load, then read the selected file
   - If **no files** exist: Inform user that no memory files are available

2. **After reading the memory file**:
   - Present the contents to understand current context
   - Summarize key points:
     - What task/project is in progress
     - Current status (completed/pending items)
     - Next steps
     - Any blockers or issues
   - Ask user: "Ready to continue from here, or do you want to update the context first?"

3. **Memory file purpose**:
   - Token-optimized context dumps for session continuity
   - Serves as todo tracker
   - References other cc/ or .claude/plans/ files
   - Enables seamless work resumption

**Goal**: Quickly restore full context and continue work where it was left off.
