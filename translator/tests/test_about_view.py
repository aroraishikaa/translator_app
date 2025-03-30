from django.test import TestCase, Client
from django.urls import reverse


class AboutViewTest(TestCase):
    """Test cases for the about view"""

    def setUp(self):
        """Set up test client"""
        self.client = Client()
        self.url = reverse('about')  # Using the URL name from urls.py

    def test_about_view_status_code(self):
        """Test that the about view returns a 200 status code"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_about_view_uses_correct_template(self):
        """Test that the about view uses the correct template"""
        response = self.client.get(self.url)
        self.assertTemplateUsed(response, 'translator/about.html')

    def test_about_view_has_expected_content(self):
        """Test that the about view contains expected content"""
        response = self.client.get(self.url)
        
        # Check for key elements that should be on the page
        self.assertContains(response, 'About Hingo Translate')
        self.assertContains(response, 'Hingo Translate is designed to help Hinglish speakers')
        
        # Check for specific UI elements
        self.assertContains(response, 'class="about-container"')
        self.assertContains(response, 'class="about-card"')