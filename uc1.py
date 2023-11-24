from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import logging
 
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
 
# Set the logging level to debug for detailed logs
app.logger.setLevel(logging.DEBUG)
 
# Define the Azure OpenAI endpoint
AZURE_OPENAI_ENDPOINT = "https://gen-ai-demo.openai.azure.com/openai/deployments/open-ai-gpt35/chat/completions?api-version=2023-07-01-preview"
 
# Replace 'your_azure_openai_api_key' with your actual Azure OpenAI API key
AZURE_OPENAI_API_KEY = 'f39237474a6546c8ad3f14d3931ff7d7'
 
@app.route('/api/generate_requirements', methods=['POST'])
def generate_requirements():
    data = request.get_json()
    project_description = data.get('project_description', '')
    functional_requirements = generate_functional_requirements(project_description)
    return jsonify({'functional_requirements': functional_requirements})
 
def generate_functional_requirements(project_description):
    # Construct a message for Azure OpenAI chat completion with the project description
    messages = [
        {"role": "user",  "content": "Generate a comprehensive Functional Requirements section for the project, expanding on each of the following requirements with detailed explanations of a minimum of 400 words or more. Ensure that each requirement is described clearly, thoroughly, and consistently aligned with the project description. Additionally, provide context from the relevant domain for each requirement to enhance understanding and relevance."},
        {"role": "assistant", "content": project_description},
    ]
 
    # Make a POST request to Azure OpenAI
    response = requests.post(
        AZURE_OPENAI_ENDPOINT,
        headers={
            "Content-Type": "application/json",
            "api-key": AZURE_OPENAI_API_KEY
        },
        json={"messages": messages}
    )
 
    # Parse the response and handle errors
    try:
        response_data = response.json()
        # app.logger.debug("Azure OpenAI API Response: %s", response_data)  # Log the response for debugging
 
        functional_requirements = response_data["choices"][0]["message"]["content"]
    except KeyError:
        functional_requirements = "Error: Unable to generate functional requirements from Azure OpenAI API."
 
    return functional_requirements
 
if __name__ == '__main__':
    app.run(debug=True)
