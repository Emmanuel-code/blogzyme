from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AffiliateViewSet, BlogPostViewSet, CategoryListView

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet)
router.register(r'affiliate', AffiliateViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('categories/', CategoryListView.as_view(), name='categories'),
]
