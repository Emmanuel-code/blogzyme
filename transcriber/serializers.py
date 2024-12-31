from rest_framework import serializers
from rest_framework import serializers
from .models import AffiliateProduct,   BlogPost
from django.db.models import Q
import re
from typing import List

from rest_framework import serializers
from .models import BlogPost

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'content', 'slug', 'category',  # Remove 'matching_products'
            'status', 'created_at', 'updated_at', 'image_url'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

class AffiliateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = AffiliateProduct
        fields = [
            'id', 'name', 'description', 'price', 
            'affiliate_link', 'category', 'brand', 
            'keywords', 'commission_rate', 'image_url'
        ]
         