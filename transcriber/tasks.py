
import time
import logging
from celery import shared_task

from .models import BlogPost
from .sevices.ai_generator import AIContentGenerator
from .unsplash_api import UnsplashService
# from backend.ai import AIContentGenerator  # Ensure this import is correct
# from backend.unsplash import UnsplashService
# from backend.models import BlogPost

# Set up logging
logger = logging.getLogger(__name__)

# Define the minimum content length
MIN_CONTENT_LENGTH = 300
MAX_RETRIES = 3
RETRY_DELAY = 60  # 60 seconds wait time before retrying

# Helper functions
MAX_RETRIES = 5  # Set a maximum number of retries
RETRY_DELAY = 60  # Delay in seconds between retries (1 minute)

def handle_api_rate_limit(category):
    """Handles API rate limiting by retrying after waiting."""
    generator = AIContentGenerator()  # Initialize the generator

    retry_count = 0
    while retry_count < MAX_RETRIES:
        try:
            # Try generating a title (or content)
            title = generator.generate_blog_title(category)
            if title:
                return title
            else:
                logger.warning(f"Failed to generate title for category: {category}")
                return None
        except Exception as e:
            logger.error(f"Error during title generation for category {category}: {e}")
            retry_count += 1
            if retry_count < MAX_RETRIES:
                logger.info(f"Retrying... ({retry_count}/{MAX_RETRIES})")
                time.sleep(RETRY_DELAY)  # Wait before retrying
            else:
                logger.critical("Maximum retries reached. Failing the operation.")
                return None


# Define your task to be called by Celery or any background job queue.
def generate_blog_post_for_category(category):
    """
    Main function that will be called to generate a blog post title and content.
    """
    generator = AIContentGenerator()
    
    # Generate a title based on the category
    title = generator.generate_blog_title(category)
    if not title:
        logger.error(f"Title generation failed for category: {category}. Skipping...")
        return f"Title generation failed for category: {category}."
    
    # Validate the generated title
    if not validate_title(title):
        logger.warning(f"Invalid title generated: {title}")
        return f"Invalid title generated: {title}"

    # Generate content based on the title
    content = generator.generate_content_for_title(title)
    
    # Ensure content meets the length requirement (fallback if needed)
    if len(content) < 100:
        logger.warning(f"Content for title '{title}' is too short. Fetching fallback content...")
        content = generator.fetch_fallback_content(title)
    
    # Save the blog post to the database
    try:
        save_blog_post_to_db(title, content)
        logger.info(f"Blog post for title '{title}' saved successfully.")
        return f"Blog post for title '{title}' saved successfully."
    except Exception as e:
        logger.error(f"Failed to save blog post for title '{title}'. Error: {str(e)}")
        return f"Failed to save blog post for title '{title}'. Error: {str(e)}"


def validate_title(title):
    """
    Validates the title before saving it (can add custom validation rules).
    """
    forbidden_keywords = ['ultimate', 'game-changer', 'threat', 'unforgettable']
    for word in forbidden_keywords:
        if word.lower() in title.lower():
            return False
    if len(title) < 10 or len(title) > 200:
        return False
    return True


def save_blog_post_to_db(title, content):
    """
    Saves the blog post to the database (replace with actual Django model save logic).
    """
    if len(content) < 100:
        raise ValueError("Content must be at least 100 characters long.")
    
    # Create and save the blog post (adjust based on your model)
    BlogPost.objects.create(title=title, content=content)


# Example usage of the rate limit handling in a retry logic scenario
def handle_task_with_rate_limit(category):
    """
    This function handles rate limits by retrying with the handle_api_rate_limit function.
    """
    return handle_api_rate_limit(generate_blog_post_for_category, category)

def clean_title(title):
    """Cleans up the title if necessary (e.g., trims whitespace)."""
    return title.strip()

def validate_content(content):
    """Ensures the content is long enough and meets necessary criteria."""
    if len(content) < MIN_CONTENT_LENGTH:
        logger.warning(f"Content is too short. Length: {len(content)}")
        return False
    return True

def get_fallback_content(title):
    """Fetches fallback content if the generated content is too short."""
    logger.info(f"Fetching fallback content for title: {title}")
    # Here you can add logic to return default or cached content
    return f"Here's some fallback content for {title}."

def handle_api_rate_limit(category):
    """Handles API rate limiting by retrying after waiting."""
    generator = AIContentGenerator()  # Define the generator here
    retry_count = 0
    while retry_count < MAX_RETRIES:
        try:
            # Try generating a title (or content)
            title = generator.generate_blog_title(category)
            if title:
                return title
        except Exception as e:
            logger.error(f"API rate limit hit: {e}")
            retry_count += 1
            time.sleep(RETRY_DELAY)  # Delay before retrying
    logger.error("API rate limit exceeded multiple times. Skipping title generation.")
    return None

def generate_valid_title(category):
    """Tries to generate a valid title. If it fails, falls back to a default."""
    try:
        # Ensure generator is instantiated correctly
        generator = AIContentGenerator()  # Define the generator here
        title = generator.generate_blog_title(category)
        if not title:
            raise ValueError("Generated title is None.")
        return title
    except Exception as exc:
        logger.error(f"Title generation failed: {exc}. Falling back...")
        return f"Discover Insights into {category.title()}"

# Celery Task

@shared_task(bind=True, max_retries=3)
def generate_blog_posts(self):
    # Ensure generator is instantiated correctly
    generator = AIContentGenerator()  # Define the generator here
    unsplash = UnsplashService()
    categories = [cat[0] for cat in BlogPost.CATEGORIES]

    for category in categories:
        retry_count = 0
        title = None

        # Attempt to generate a valid title
        while retry_count < 3:
            title = generate_valid_title(category)
            if title:
                title = clean_title(title)
                if validate_title(title):
                    break
            retry_count += 1

        if not title:
            logger.error(f"Failed to generate valid title for category: {category}. Skipping...")
            continue

        # Generate content
        try:
            content = generator.generate_blog_content(title, category)

            if not validate_content(content):
                logger.warning(f"Content for title '{title}' is too short. Trying fallback...")
                content = get_fallback_content(title)

            content = content[:5000]  # truncate if needed

        except Exception as exc:
            logger.error(f"Content generation failed for title: {title}. Skipping... Error: {exc}")
            continue

        # Fetch image
        image_url = unsplash.search_image(title) or ""

        # Save blog post
        try:
            BlogPost.objects.create(
                title=title[:200],  # Ensure title length doesn't exceed DB limit
                content=content,
                category=category,
                image_url=image_url[:200],  # Ensure URL length doesn't exceed DB limit
                status="published"
            )
            logger.info(f"Blog post created successfully for category: {category}")
        except Exception as exc:
            logger.error(f"Failed to save blog post for title: {title}. Error: {exc}")
