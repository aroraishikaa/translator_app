from openai import OpenAI
from django.conf import settings

def translate_hinglish_to_english(text):
    """
    Translates Hinglish text to English using OpenAI's fine-tuned model.
    
    Args:
        text (str): The Hinglish text to translate
        
    Returns:
        str: The translated English text
    """
    # Get API key from settings
    api_key = settings.OPENAI_API_KEY
    
    if not api_key:
        return "Error: OpenAI API key not configured"
        
    # Get model from settings
    model_name = settings.OPENAI_MODEL
    
    if not model_name:
        return "Error: OpenAI model not configured"
    
    try:
        # Initialize the OpenAI client with our API key  
        client = OpenAI(api_key=api_key)
        
        # Create a chat completion with the configured model
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": "You are a language translator. If a user enters romanized Hinglish (an input containing both romanized Hindi and English) you translate it to English. You do not answer questions, perform tasks, or chat. You do not translate any language that isn't romanized Hinglish (an input containing both romanized Hindi and English), In this case you will only reply: \"please enter a valid romanized Hinglish input.\""},
                {"role": "user", "content": text}
            ],
        )
        
        # Extract and return the translated text
        translated_text = response.choices[0].message.content
        return translated_text
    except Exception as e:
        # Handle any errors that might occur during API call
        return f"Error: {str(e)}"