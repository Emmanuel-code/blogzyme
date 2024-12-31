import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class UnsplashService:
    BASE_URL = "https://api.unsplash.com"
    
    def __init__(self):
        self.api_key = settings.UNSPLASH_ACCESS_KEY  # Load from settings
    
    def search_image(self, query: str):
        try:
            url = f"{self.BASE_URL}/search/photos"
            params = {
                "query": query,
                "per_page": 1,
                "orientation": "landscape",
                "client_id": self.api_key
            }
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            if data["results"]:
                return data["results"][0]["urls"]["regular"]
            return None
        except Exception as e:
            logger.error(f"Unsplash image search failed: {e}")
            return None
