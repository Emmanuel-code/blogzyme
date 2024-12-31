
import google.generativeai as genai
import logging
import re  # Add this import for regex operations
from django.conf import settings
from django.core.cache import cache
from django.utils.text import slugify  # Ensure this import is present

logger = logging.getLogger(__name__)

class AIContentGenerator:
    def __init__(self):
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.title_model = genai.GenerativeModel('gemini-pro')
            self.content_model = genai.GenerativeModel('gemini-pro')
        except Exception as e:
            logger.critical(f"Failed to initialize Gemini AI: {e}")
            raise
    
    def _get_cached_or_generate(self, cache_key, generation_func, timeout=3600):
        """
        Caching mechanism to prevent redundant API calls
        """
        try:
            cached_result = cache.get(cache_key)
            if cached_result:
                return cached_result
            
            result = generation_func()
            if result:
                cache.set(cache_key, result, timeout)
            return result
        except Exception as e:
            logger.error(f"Caching generation error: {e}")
            return None
    
    def generate_blog_title(self, category=None):
        """Generate unique blog titles with optional category focus"""
        try:
            categories = [category] if isinstance(category, str) else (
                category or [
                    'Entertainment', 'Lifestyle', 'Politics', 
                    'Travel', 'Sports', 'Technology'
                ]
            )
            
            def _generate():
                try:
                    prompt = f"""Generate a single compelling, viral-worthy blog post title not more than 200 characters
                    specifically for these categories: {', '.join(categories)}.
                    Titles should be provocative, current, and clickbait-worthy.
                    Respond with ONLY the title, no additional text."""
                    
                    response = self.title_model.generate_content(prompt)
                    generated_title = response.text.strip()
                    
                    # Validation
                    if not generated_title or len(generated_title) < 10 or len(generated_title) > 200:
                        logger.warning(f"Invalid title generated: {generated_title}")
                        return None
                    
                    return generated_title
                except Exception as gen_e:
                    logger.error(f"Title generation error: {gen_e}")
                    return None
            
            # Use a consistent hash for caching
            cache_key = f"blog_title_{hash(tuple(categories))}"
            return self._get_cached_or_generate(cache_key, _generate)
        
        except Exception as e:
            logger.error(f"Blog title generation failed: {e}")
            return None
    
    def generate_blog_content(self, title, category):
        """Advanced content generation with comprehensive error handling"""
        categories = [category] if isinstance(category, str) else (
                category or [
                    'Entertainment', 'Lifestyle', 'Politics', 
                    'Travel', 'Sports', 'Technology'
                ]
            )
            
        try:
            def _generate():
                try:
                    prompt = f"""Generate a detailed, engaging blog post based on this title:
                    '{title}'. The content should be relevant to the following categories: {', '.join(categories)}.
                    Ensure the content is engaging and provides useful information for the reader."""
                    
                    response = self.content_model.generate_content(prompt)
                    generated_content = response.text.strip()
                    
                    # Validation
                    if not generated_content or len(generated_content) < 100:
                        logger.warning(f"Generated content too short: {generated_content}")
                        return None
                    
                    logger.info(f"Generated content validated successfully.")
                    return generated_content
                except Exception as gen_e:
                    logger.error(f"Content generation error: {gen_e}")
                    return None

            # Create cache key using slugified title
            cache_key = f"blog_content_{slugify(title)}"
            return self._get_cached_or_generate(cache_key, _generate)
        
        except Exception as e:
            logger.error(f"Blog content generation failed for title '{title}': {e}")
            return None
    
    def _clean_markdown(self, content):
        """
        Clean up markdown and formatting
        """
        try:
            # Remove excessive markdown
            content = re.sub(r'^#+\s*', '', content, flags=re.MULTILINE)
            content = re.sub(r'[\*_]{1,2}', '', content)
            
            # Remove extra whitespace
            content = re.sub(r'\n{3,}', '\n\n', content)
            
            return content.strip()
        except Exception as e:
            logger.error(f"Markdown cleaning error: {e}")
            return content
