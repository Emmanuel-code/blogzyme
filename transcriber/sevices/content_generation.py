# services/content_generation.py
import logging
from django.conf import settings
from typing import Optional, Dict, Any

from .ai_generator import AIContentGenerator
from ..unsplash_api import UnsplashService

class ContentGenerationService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def generate_content(
        self, 
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Central method for content generation with robust error handling
        
        Args:
            context (dict): Generation parameters and context
        
        Returns:
            dict: Generated content details
        """
        try:
            # Validate and set defaults
            title = self._prepare_title(context)
            category = context.get('category', 'lifestyle')
            min_words = context.get('min_words', 500)
            max_words = context.get('max_words', 800)
            
            # Initialize generation services
            ai_generator = AIContentGenerator()
            image_service = UnsplashService()
            
            # Generate content components
            content = ai_generator.generate_blog_content(
                title, category, min_words, max_words
            )
            image_url = image_service.search_image(title)
            
            # Prepare return payload
            return {
                'title': title,
                'content': content,
                'category': category,
                'image_url': image_url,
                'status': 'published'
            }
        
        except Exception as e:
            self.logger.error(f"Content Generation Error: {e}")
            return {
                'status': 'failed',
                'error': str(e)
            }
    
    def _prepare_title(self, context: Dict[str, Any]) -> str:
        """
        Prepare or generate title based on context
        
        Args:
            context (dict): Generation context
        
        Returns:
            str: Validated or generated title
        """
        title = context.get('title')
        category = context.get('category', 'lifestyle')
        
        # If no title provided, generate one
        if not title:
            ai_generator = AIContentGenerator()
            title = ai_generator.generate_blog_title(category)
        
        # Validate title
        if not title or len(title) < 5:
            raise ValueError("Invalid or too short title")
        
        return title