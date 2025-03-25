from django.shortcuts import render

def translation(request):
    """
    View for the home page with the translation interface
    """
    return render(request, 'translator/translation.html')