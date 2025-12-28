---
description: "Generate conventional commit message from staged changes"
tools: ["Bash"]
---

# Generate Conventional Commit Message

Analyze the staged changes and generate a conventional commit message following best practices.

## Current Staged Changes

**Files:**
!`git diff --staged --name-status`

**Diff:**
!`git diff --staged --stat`

**Detailed Changes:**
!`git diff --staged`

**Recent Commits (for style reference):**
!`git log --oneline -5`

## Instructions

Based on the staged changes above:

1. **Analyze the changes** to determine:
   - Type of change (feat, fix, refactor, docs, test, chore, style, perf, ci, build)
   - Scope (optional): affected component/module
   - Breaking changes (if any)

2. **Generate a commit message** following conventional commits format:
   ```
   <type>(<scope>): <short description>

   <longer description if needed>

   <footer with breaking changes, issues, etc.>
   ```

3. **Guidelines**:
   - Use imperative mood ("add" not "added" or "adds")
   - Keep first line under 72 characters
   - Capitalize first letter of description
   - No period at end of first line
   - Explain WHY not WHAT (code shows what)
   - Include breaking changes in footer with "BREAKING CHANGE:"
   - Reference issues with "#123" if applicable

4. **Output** the commit message ready to copy/paste

5. **Add the footer**:
   ```
   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

Provide ONLY the final commit message, no additional commentary.
