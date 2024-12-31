# import re
# from typing import List
# from .models import AffiliateProduct, BlogPost, BlogPostProductRecommendation

# def extract_keywords(text: str) -> List[str]:
#     stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from'}
#     text = re.sub(r'[^\w\s]', '', text.lower())
#     words = [word for word in text.split() if word not in stop_words and len(word) > 2]
#     return list(dict.fromkeys(words))[:15]

# def calculate_relevance(blog_post: BlogPost, product: AffiliateProduct) -> float:
#     try:
#         post_keywords = set(extract_keywords(blog_post.content))
#         product_keywords = set(product.keywords.lower().split(','))
#         matches = post_keywords.intersection(product_keywords)
        
#         keyword_relevance = len(matches) / len(post_keywords.union(product_keywords)) * 100
#         category_match = (blog_post.category.lower() == product.category.lower()) * 20
        
#         total_score = (keyword_relevance * 0.7) + (category_match * 0.3)
#         return min(max(total_score, 0), 100)
#     except Exception as e:
#         return 0.0

# def recommend_products_for_blog_post(blog_post: BlogPost, limit: int = 5) -> List[BlogPostProductRecommendation]:
#     active_products = AffiliateProduct.objects.filter(is_active=True)
#     recommendations = []

#     for product in active_products:
#         relevance = calculate_relevance(blog_post, product)
#         if relevance > 20:
#             recommendation, created = BlogPostProductRecommendation.objects.get_or_create(
#                 blog_post=blog_post,
#                 product=product,
#                 defaults={'relevance_score': relevance, 'manually_added': False}
#             )
#             if not created and recommendation.relevance_score != relevance:
#                 recommendation.relevance_score = relevance
#                 recommendation.save()
#             recommendations.append(recommendation)

#     recommendations.sort(key=lambda x: x.relevance_score, reverse=True)
#     return recommendations[:limit]

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from django.db.models import Q
import nltk
nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)

def extract_keywords(text, max_keywords=10):
    stop_words = set(stopwords.words('english')) 

    tokens = word_tokenize(text.lower())    
    keywords=[token for token in tokens if token.lower() not in stop_words and len(token)>2]
    keywords=list(dict.fromkeys(keywords)) [:max_keywords]  

    # keywords = [token for token in tokens if len(token) > 2]
    return keywords