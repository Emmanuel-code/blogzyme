from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.core.exceptions import ValidationError

from django.db import models
from django.core.validators import URLValidator, MinLengthValidator
from django.utils import timezone
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.conf import settings

class BlogPost(models.Model):
    CATEGORIES = [
        ('entertainment', 'Entertainment'),
        ('lifestyle', 'Lifestyle'),
        ('politics', 'Politics'),
        ('travel', 'Travel'),
        ('sports', 'Sports'),
        ('technology', 'Technology'),
        ('health', 'Health'),
        ('science', 'Science')
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('failed', 'Generation Failed')
    ]
    
    title = models.CharField(max_length=300)
    content = models.TextField()
    slug = models.SlugField(unique=True, max_length=300)
    category = models.CharField(
        max_length=20, 
        choices=CATEGORIES, 
        default='lifestyle'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    image_url = models.URLField(
        verbose_name="Featured Image",
        help_text="Main image URL for the blog post",
        blank=True,
        null=True
    )
   
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['category', 'created_at']),
            models.Index(fields=['slug']),
        ]
        ordering = ['-created_at']
    
    def clean(self):
        if len(self.title) < 5:
            raise ValidationError({'title': 'Title must be at least 5 characters long'})
        if len(self.content) < 100:
            raise ValidationError({'content': 'Content must be at least 100 characters long'})
    
    def save(self, *args, **kwargs):
        self.clean()
        if not self.slug:
            base_slug = slugify(self.title)
            unique_slug = base_slug
            counter = 1
            while BlogPost.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.title} - Image: {self.image_url or 'No Image'}"



class AffiliateProduct(models.Model):
    PRODUCT_CATEGORIES = [
        ('electronics', 'Electronics'),
        ('books', 'Books'),
        ('clothing', 'Clothing'),
        ('home', 'Home & Kitchen'),
        ('health', 'Health & Wellness'),
        ('technology', 'Technology'),
        ('sports', 'Sports & Outdoors'),
        ('beauty', 'Beauty & Personal Care')
    ]

    name = models.CharField(max_length=300, validators=[MinLengthValidator(3)])
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    affiliate_link = models.URLField(unique=True)
    category = models.CharField(
        max_length=20, 
        choices=PRODUCT_CATEGORIES, 
        default='electronics'
    )
    brand = models.CharField(max_length=100, blank=True, null=True)
    keywords = models.TextField(
        help_text="Comma-separated keywords for product discovery",
        blank=True
    )
    commission_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        help_text="Percentage of commission"
    )
    image_url = models.URLField(
        verbose_name="Product Image",
        blank=True,
        null=True
    )
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['category', 'brand']),
            models.Index(fields=['keywords'])
        ]
        ordering = ['-created_at']
        

    def clean(self):
        if self.price < 0:
            raise ValidationError({'price': 'Price must be a positive value'})
        
        if self.commission_rate < 0 or self.commission_rate > 100:
            raise ValidationError({'commission_rate': 'Commission rate must be between 0 and 100'})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - ${self.price} ({self.brand or 'No Brand'})"

