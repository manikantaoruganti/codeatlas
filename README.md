

# CodeAtlas AI

**CodeAtlas AI** is a multi-language **Code Review and Refactoring Intelligence Platform** designed to help developers analyze code quality, detect complexity hotspots, and generate structured refactoring strategies.

The system combines **static analysis**, **rule-based intelligence**, and an optional **AI reasoning layer** to improve maintainability, performance, and developer productivity.

---

# Project Vision

Modern codebases grow complex over time.
Developers often struggle to:

* Identify risky or complex modules
* Decide what to refactor first
* Maintain performance and readability
* Understand structural weaknesses

**CodeAtlas AI** solves this by providing:

* Code Health Index
* Multi-language analysis
* Hotspot detection
* Refactor prioritization
* Optional AI insights
* Integrated execution environment

---

# Key Features

## Code Health Index (CHI)

* Custom metric (0–100)
* Represents maintainability and structural quality
* Based on complexity, smells, and duplication

---

## Multi-Language Support

Initial supported languages:

* Python
* JavaScript
* C++
* Java
* Go
* Rust
* SQL
* Bash

Language-adapter architecture allows future expansion.

---

## Static Analysis Engine

Detects:

* Long functions
* Deep nesting
* High branching
* Large files
* Structural risks

---

## Hotspot Detection

Identifies:

* Most complex files
* Risky modules
* Refactor priority areas

Provides heatmap-ready data.

---

## Refactor Strategy Engine

Generates:

* Prioritized improvement steps
* Recommended refactor patterns
* Estimated impact

Example:

* Extract methods
* Reduce nesting
* Remove duplication

---

## AI-Ready Architecture

Supports multiple providers via `.env`:

* OpenAI
* Gemini
* HuggingFace
* Local LLM
* Disabled understands system

Core analysis works **without AI**.

---

## Integrated Compiler Module

Allows developers to:

* Test refactored code
* Run snippets
* Validate logic

Execution engine designed for containerized runtime.

---

# System Architecture

```
User Input (File / Repo)
        ↓
Repo Scanner
        ↓
Language Adapters
        ↓
Metrics Engine
        ↓
Smell Detection
        ↓
Code Health Index
        ↓
Refactor Strategy Engine
        ↓
AI Insight Layer (Optional)
        ↓
Dashboard & Reports
```

---

# Technology Stack

## Frontend

* React (JavaScript)
* Tailwind CSS
* Interactive Code Editor
* Recharts

## Backend

* Python (Analysis Engine)
* Node-compatible API design

## Infrastructure

* Docker-ready execution environment
* Environment-based configuration

---

# Folder Structure

```
backend/
  analysis_engine/
  refactor_engine/
  ai_orchestrator/
  compiler_service/
  models/

frontend/
  src/
    components/
    pages/
    services/
```

---

# Setup Instructions

## Backend

```
cd backend
pip install -r requirements.txt
python server.py
```

---

## Frontend

```
cd frontend
npm install
npm start
```

App runs at:

```
http://localhost:3000
```

---

# Environment Configuration

Create `.env`:

```
AI_PROVIDER=none

OPENAI_API_KEY=
GEMINI_API_KEY=
HF_API_KEY=
```

System works even when AI is disabled.

---

# Performance Goals

* Fast structural analysis
* Non-blocking UI
* Modular service architecture
* Scalable multi-language support

---

# Security Considerations

* No persistent storage of user code
* Execution sandbox design
* Input size limits
* Provider-agnostic configuration

---

# Future Enhancements

* GitHub repository integration
* Pull request review assistant
* Historical code health tracking
* Team collaboration mode
* Auto documentation generation


  ---
  # Performance Note

This application(https://glistening-mermaid-54ec41.netlify.app/) is optimized for desktop/laptop environments.

Mobile browsers may experience reduced performance during large file or ZIP analysis due to heavy chart rendering and GPU-intensive Ul effects.

