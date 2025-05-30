from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json
from .translator_service import translate_hinglish_to_english

def translation(request):
    """
    View for the home page with the translation interface
    """
    return render(request, 'translator/translation.html')

def about(request):
    """
    View for the about page
    """
    return render(request, 'translator/about.html')

@require_POST
def translate_text(request):
    """
    API endpoint to handle translation requests
    """
    try:
        # Parse the JSON data from the request
        data = json.loads(request.body)
        input_text = data.get('text', '')
        
        if not input_text:
            return JsonResponse({'translation': 'Please enter some text to translate'})
        
        # Call the translation service
        translated_text = translate_hinglish_to_english(input_text)
        
        # Check if there was an error in the translation service
        if translated_text.startswith('Error:'):
            return JsonResponse({'error': translated_text[7:]}, status=500)
        
        # Return the translated text
        return JsonResponse({'translation': translated_text})
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    