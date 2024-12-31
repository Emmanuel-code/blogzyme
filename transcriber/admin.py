from django.contrib import admin
from django.utils.html import format_html
from .models import  AffiliateProduct, BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    """
    Customized admin interface for BlogPost model
    """
    list_display = (
        'title', 
        'category', 
        'status', 
        'created_at', 
        'display_image'
    )
    
    list_filter = (
        'category', 
        'status', 
        'created_at'
    )
    
    search_fields = (
        'title', 
        'content'
    )
    
    readonly_fields = (
        'slug', 
        'created_at', 
        'updated_at'
    )
    
    date_hierarchy = 'created_at'
    
    def display_image(self, obj):
        """
        Render thumbnail in admin list view
        """
        if obj.image_url:
            return format_html(
                '<img src="{}" style="max-width:100px; max-height:100px;" />',
                obj.image_url
            )
        return 'No Image'
    
    display_image.short_description = 'Featured Image'



 
admin.site.register(AffiliateProduct)
 