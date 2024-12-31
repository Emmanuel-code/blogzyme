

# management/commands/process_blog_generators.py
from django.core.management.base import BaseCommand
from django.db.models import Q

from ...models import BlogPostGenerator

from ...tasks import process_blog_post_generation

class Command(BaseCommand):
    help = 'Process pending blog post generation requests'

    def handle(self, *args, **options):
        # Find pending generators
        pending_generators = BlogPostGenerator.objects.filter(
            Q(status='pending') | Q(status='processing')
        )

        for generator in pending_generators:
            # Trigger Celery task for each generator
            process_blog_post_generation.delay(generator.id)

            self.stdout.write(
                self.style.SUCCESS(
                    f'Queued blog post generation for generator {generator.id}'
                )
            )
