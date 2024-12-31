from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action,api_view
from rest_framework.response import Response
from .models import BlogPost, AffiliateProduct
from .serializers import  BlogPostSerializer, AffiliateProductSerializer
from rest_framework.views import APIView
from rest_framework import status
from django.db.models import Q, Count

# from nltk.tokenize import word_tokenize
# from nltk.corpus import stopwords


# def extract_keywords(text):
#     stop_words = set(stopwords.words('english')) 

#     tokens = word_tokenize(text)    
#     tokens=[token for token in tokens if token.lower() not in stop_words]
#     query = Q()
#     for keyword in tokens:
#         query=Q(contain__icontains=keyword)

#     # keywords = [token for token in tokens if len(token) > 2]
#     products=AffiliateProduct.objects.filter(query).exclude(id=text.name)
#     return products

class AffiliateViewSet(viewsets.ModelViewSet):
    queryset = AffiliateProduct.objects.all()
    serializer_class = AffiliateProductSerializer
    lookup_field = 'slug'

# blog/views.py
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import BlogPost, AffiliateProduct
from .serializers import BlogPostSerializer, AffiliateProductSerializer

class AffiliateViewSet(viewsets.ModelViewSet):
    queryset = AffiliateProduct.objects.all()
    serializer_class = AffiliateProductSerializer
    lookup_field = 'slug'

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

    @action(detail=False, methods=['get'], url_path='category/(?P<category>[^/.]+)')
    def get_posts_by_category(self, request, category=None):
        """
        Fetch blog posts by category.
        """
        posts = BlogPost.objects.filter(category=category, status='published')  # Ensure 'published' filter
        if not posts.exists():
            return Response(
                {"message": f"No posts found in the category '{category}'."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = BlogPostSerializer(posts, many=True)
        return Response(serializer.data)

class CategoryListView(APIView):
    """
    API endpoint to list all categories.
    """
    def get(self, request):
        categories = BlogPost.CATEGORIES
        category_list = [{"key": key, "name": name} for key, name in categories]
        return Response(category_list, status=status.HTTP_200_OK)
