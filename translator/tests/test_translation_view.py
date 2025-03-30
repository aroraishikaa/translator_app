from django.test import TestCase, Client
from django.urls import reverse


class TranslationViewTest(TestCase):
    """Test cases for the translation view"""

    def setUp(self):
        """Set up test client"""
        self.client = Client()
        self.url = reverse('translation')  # Using the URL name from urls.py

    def test_translation_view_status_code(self):
        """Test that the translation view returns a 200 status code"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_translation_view_uses_correct_template(self):
        """Test that the translation view uses the correct template"""
        response = self.client.get(self.url)
        self.assertTemplateUsed(response, 'translator/translation.html')

    def test_translation_view_has_expected_content(self):
        """Test that the translation view contains expected content"""
        response = self.client.get(self.url)
        
        # Check for key elements that should be on the page
        self.assertContains(response, 'Hingo Translate')
        self.assertContains(response, 'Hinglish – English')
        self.assertContains(response, 'Type in Hinglish to translate to English')
        
        # Check for translation form elements
        self.assertContains(response, 'class="text-box input-box"')
        self.assertContains(response, 'class="text-box output-box"')
        self.assertContains(response, 'Translate</button>')