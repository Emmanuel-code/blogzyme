# Generated by Django 5.0.6 on 2024-12-06 09:32

import django.core.validators
import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcriber', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AffiliateProduct',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=300, validators=[django.core.validators.MinLengthValidator(3)])),
                ('description', models.TextField(blank=True, null=True)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('affiliate_link', models.URLField(unique=True)),
                ('category', models.CharField(choices=[('electronics', 'Electronics'), ('books', 'Books'), ('clothing', 'Clothing'), ('home', 'Home & Kitchen'), ('health', 'Health & Wellness'), ('technology', 'Technology'), ('sports', 'Sports & Outdoors'), ('beauty', 'Beauty & Personal Care')], default='electronics', max_length=20)),
                ('brand', models.CharField(blank=True, max_length=100, null=True)),
                ('keywords', models.TextField(blank=True, help_text='Comma-separated keywords for product discovery')),
                ('commission_rate', models.DecimalField(decimal_places=2, help_text='Percentage of commission', max_digits=5)),
                ('image_url', models.URLField(blank=True, null=True, verbose_name='Product Image')),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-created_at'],
                'indexes': [models.Index(fields=['category', 'brand'], name='transcriber_categor_e67dbc_idx'), models.Index(fields=['keywords'], name='transcriber_keyword_3a1867_idx')],
            },
        ),
        migrations.CreateModel(
            name='BlogPostProductRecommendation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('relevance_score', models.FloatField(default=0.0, help_text='Calculated relevance of the product to the blog post')),
                ('manually_added', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('blog_post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='product_recommendations', to='transcriber.blogpost')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blog_recommendations', to='transcriber.affiliateproduct')),
            ],
            options={
                'ordering': ['-relevance_score'],
                'unique_together': {('blog_post', 'product')},
            },
        ),
    ]
