import os

PROMPT_TEMPLATES = {
    "maintainability": """
You are a code review expert. Analyze the following code analysis results and provide insights on maintainability:

Health Index: {health_index}/100
Total Files: {total_files}
Average Complexity: {avg_complexity}
Code Smells: {smell_count}

Provide:
1. Key maintainability concerns
2. Top 3 priority actions
3. Long-term recommendations
""",
    
    "performance": """
You are a performance optimization expert. Review these code metrics:

Complexity Metrics:
- Average Complexity: {avg_complexity}
- Hotspots: {hotspot_count}

Identify:
1. Performance bottlenecks
2. Optimization opportunities
3. Competitive programming improvements
""",
    
    "refactoring": """
You are a refactoring specialist. Based on this analysis:

Risk Score: {risk_score}
Code Smells: {smell_count}
Hotspots: {hotspot_count}

Provide:
1. Refactoring strategy
2. Step-by-step approach
3. Expected impact
"""
}

class AIOrchestrator:
    """AI provider orchestration"""
    
    def __init__(self):
        self.provider = os.environ.get('AI_PROVIDER', 'none')
        self.enabled = os.environ.get('ENABLE_AI_EXPLANATIONS', 'false').lower() == 'true'
    
    def is_available(self) -> bool:
        """Check if AI is available"""
        return self.enabled and self.provider != 'none'
    
    async def get_insights(self, analysis_data: dict, intent: str = "maintainability") -> str:
        """Get AI insights based on analysis"""
        
        if not self.is_available():
            return "AI insights are currently disabled. Enable AI_PROVIDER in settings."
        
        # Get prompt template
        template = PROMPT_TEMPLATES.get(intent, PROMPT_TEMPLATES["maintainability"])
        prompt = template.format(**analysis_data)
        
        # Call appropriate provider
        if self.provider == 'openai':
            return await self._call_openai(prompt)
        elif self.provider == 'gemini':
            return await self._call_gemini(prompt)
        elif self.provider == 'huggingface':
            return await self._call_huggingface(prompt)
        else:
            return "AI provider not configured"
    
    async def _call_openai(self, prompt: str) -> str:
        """Call OpenAI API"""
        # Placeholder for OpenAI integration
        return "OpenAI integration ready. Add OPENAI_API_KEY to enable."
    
    async def _call_gemini(self, prompt: str) -> str:
        """Call Gemini API"""
        # Placeholder for Gemini integration
        return "Gemini integration ready. Add GEMINI_API_KEY to enable."
    
    async def _call_huggingface(self, prompt: str) -> str:
        """Call HuggingFace API"""
        # Placeholder for HuggingFace integration
        return "HuggingFace integration ready. Add HF_API_KEY to enable."