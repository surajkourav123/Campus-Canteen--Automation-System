# Cloude Code ToolBox — MCP & Skills awareness

_Generated: 2026-05-19T11:24:08.149Z_

## How to use this report

- **Saved copy:** This file is **`.claude/cloude-code-toolbox-mcp-skills-awareness.md`** — refreshed whenever the toolbox runs an MCP & Skills scan (including on workspace open when auto-scan is enabled). It is meant for **Claude Code workspace context** together with `CLAUDE.md` (which gets a shorter replaceable summary when auto-merge is on).
- **MCP:** Lists **configured** servers from Claude Code config (`~/.claude.json` for user scope, `.mcp.json` for project scope). Use `/mcp` in the Claude Code panel to connect servers for your session.
- **Skills:** **On-disk** folders with `SKILL.md`. Claude Code does not auto-load them; attach `SKILL.md` or paths in chat when useful.
- **Task routing:** When the user’s request matches a server’s purpose (e.g. Confluence → Confluence/Atlassian MCP), prefer that **server id** from the tables below.

---

## MCP — workspace

Workspace `mcp.json` _(folder: Campus Canteen Automation System)_

- **d:\PROJECTS\Campus Canteen Automation System\.mcp.json** — _File missing_

_No active workspace servers in mcp.json._

## MCP — user profile

- **C:\Users\suraj kaurav\.claude.json** — _File missing_

_No active user-scoped servers in mcp.json._

## Skills (local `SKILL.md` folders)

### Project-scoped

_None found (or no workspace open)._

### User-scoped

- **graphify** — `C:\Users\suraj kaurav\.claude\skills\graphify`
  - any input (code, docs, papers, images) → knowledge graph → clustered communities → HTML + JSON + audit report

- **design-md** — `C:\Users\suraj kaurav\.agents\skills\design-md`
  - Analyze Stitch projects and synthesize a semantic design system into DESIGN.md files

- **enhance-prompt** — `C:\Users\suraj kaurav\.agents\skills\enhance-prompt`
  - Transforms vague UI ideas into polished, Stitch-optimized prompts. Enhances specificity, adds UI/UX keywords, injects design system context, and structures output for better generation results.

- **find-skills** — `C:\Users\suraj kaurav\.agents\skills\find-skills`
  - Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a skill that can...", or express interest in extending capabilities. This skill should be used w

- **graphify** — `C:\Users\suraj kaurav\.agents\skills\graphify`
  - any input (code, docs, papers, images) - knowledge graph - clustered communities - HTML + JSON + audit report

- **react-components** — `C:\Users\suraj kaurav\.agents\skills\react-components`
  - Converts Stitch designs into modular Vite and React components using system-level networking and AST-based validation.

- **remotion** — `C:\Users\suraj kaurav\.agents\skills\remotion`
  - Generate walkthrough videos from Stitch projects using Remotion with smooth transitions, zooming, and text overlays

- **shadcn-ui** — `C:\Users\suraj kaurav\.agents\skills\shadcn-ui`
  - Expert guidance for integrating and building applications with shadcn/ui components, including component discovery, installation, customization, and best practices.

- **stitch-design** — `C:\Users\suraj kaurav\.agents\skills\stitch-design`
  - Unified entry point for Stitch design work. Handles prompt enhancement (UI/UX keywords, atmosphere), design system synthesis (.stitch/DESIGN.md), and high-fidelity screen generation/editing via Stitch MCP.

- **stitch-loop** — `C:\Users\suraj kaurav\.agents\skills\stitch-loop`
  - Teaches agents to iteratively build websites using Stitch with an autonomous baton-passing loop pattern

---

## Suggested next steps

- **MCP:** Use this extension’s hub **MCP** tab, or `claude mcp list` in the terminal. In Claude Code, use `/mcp` to connect servers for the session.
- **Edit config:** Open `~/.claude.json` (user MCP) or `<workspace>/.mcp.json` (project MCP) via the extension commands.
- **Refresh this report:** run **Intelligence — scan MCP & Skills awareness** again after changing MCP config or adding skills.

_Report from Cloude Code ToolBox extension._
