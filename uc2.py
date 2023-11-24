from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
UPLOAD_FOLDER = 'uploads'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Set the folder to store uploaded text files
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Define the Azure OpenAI endpoint
AZURE_OPENAI_ENDPOINT = "https://gen-ai-demo.openai.azure.com/openai/deployments/open-ai-gpt35/chat/completions?api-version=2023-07-01-preview"
# Replace 'your_azure_openai_api_key' with your actual Azure OpenAI API key
AZURE_OPENAI_API_KEY = 'f39237474a6546c8ad3f14d3931ff7d7'

@app.route('/api/analyze-requirements', methods=['POST'])
def analyze_requirements():
    if 'existing_requirements' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['existing_requirements']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and file.filename.endswith('.txt'):
        # Save the uploaded file
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))

        # Perform analysis
        with open(os.path.join(app.config['UPLOAD_FOLDER'], file.filename), 'r') as f:
            existing_requirements = f.read()

        analysis_results = analyze_existing_requirements(existing_requirements)
        return jsonify({'analysis_results': analysis_results})
    else:
        return jsonify({'error': 'Invalid file format. Please upload a .txt file'}), 415

# Define your analyze_existing_requirements function here
def analyze_existing_requirements(existing_requirements):
    # Construct a message for Azure OpenAI chat completion for analysis
    messages = [
        {"role": "user", "content": "Thoroughly examine the provided requirements for any inconsistencies, ambiguities, and incompleteness. Please offer a comprehensive analysis, providing detailed explanations for each identified issue,implications and any potential resolutions on the overall project. Ensure that the analysis is clear, extensive, and meticulously addresses each aspect of the requirements.please give the result for each points"},
        {"role": "assistant", "content": existing_requirements},
    ]

    # Make a POST request to Azure OpenAI for analysis
    response = requests.post(
        AZURE_OPENAI_ENDPOINT,
        headers={
            "Content-Type": "application/json",
            "api-key": AZURE_OPENAI_API_KEY
        },
        json={"messages": messages}
    )

    try:
        response_data = response.json()
        analysis_results = response_data["choices"][0]["message"]["content"]
    except KeyError:
        analysis_results = "Error: Unable to analyze requirements using Azure OpenAI."

    return analysis_results

if __name__ == '__main__':
    app.run(debug=True, port=5001)
