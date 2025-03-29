from openai import OpenAI 
import os
from django.conf import settings

def translate_hinglish_to_english(text):
    """
    Translates Hinglish text to English using OpenAI's fine-tuned model.
    
    Args:
        text (str): The Hinglish text to translate
        
    Returns:
        str: The translated English text
    """
    try:
        # Initialize the OpenAI client with API key from settings or environment
        api_key = getattr(settings, 'OPENAI_API_KEY', os.getenv('OPENAI_API_KEY'))
        if not api_key:
            return "Error: OpenAI API key not configured"
            
        client = OpenAI(api_key=api_key)
        
        # Create a chat completion with your fine-tuned model
        response = client.chat.completions.create(
            model="ft:gpt-3.5-turbo-0125:personal:hinglish-english-200-1-b:BG0dtYvR",
            messages=[
                {"role": "system", "content": "You are a language translator. If a user enters romanized Hinglish (an input containing both romanized Hindi and English) you translate it to English. You do not answer questions, perform tasks, or chat. You do not translate any language that isn't romanized Hinglish (an input containing both romanized Hindi and English), In this case you will only reply: \"please enter a valid romanized Hinglish input.\""},
                {"role": "user", "content": text}
            ],
            temperature=0.2,  # Lower temperature for more focused translation
            max_tokens=300,   # Limit response length
        )
        
        # Extract and return the translated text
        translated_text = response.choices[0].message.content
        return translated_text
        
    except Exception as e:
        # Return error message if translation fails
        return f"Translation error: {str(e)}"