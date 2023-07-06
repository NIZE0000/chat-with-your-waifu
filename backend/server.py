from flask import Flask, request, jsonify
import torch
from transformers import LlamaForCausalLM, LlamaTokenizer

app = Flask(__name__)

# Load the AI model and tokenizer
model_path = 'psmathur/orca_mini_3b'
tokenizer = LlamaTokenizer.from_pretrained(model_path)
model = LlamaForCausalLM.from_pretrained(model_path, torch_dtype=torch.float16, device_map='auto')

# Generate text based on the input
def generate_text(system, instruction, input=None):
    if input:
        prompt = f"### System:\n{system}\n\n### User:\n{instruction}\n\n### Input:\n{input}\n\n### Response:\n"
    else:
        prompt = f"### System:\n{system}\n\n### User:\n{instruction}\n\n### Response:\n"
    
    tokens = tokenizer.encode(prompt)
    tokens = torch.LongTensor(tokens).unsqueeze(0)
    tokens = tokens.to('cuda')

    instance = {'input_ids': tokens,'top_p': 1.0, 'temperature':0.7, 'generate_len': 1024, 'top_k': 50}

    length = len(tokens[0])
    with torch.no_grad():
        rest = model.generate(
            input_ids=tokens, 
            max_length=length+instance['generate_len'], 
            use_cache=True, 
            do_sample=True, 
            top_p=instance['top_p'],
            temperature=instance['temperature'],
            top_k=instance['top_k']
        )    
    output = rest[0][length:]
    string = tokenizer.decode(output, skip_special_tokens=True)
    return f'[!] Response: {string}'

# API endpoint for generating text
@ app.route('/generate', methods=['POST'])

def generate():
    data = request.json
    system = data.get('system')
    instruction = data.get('instruction')
    input_text = data.get('input')

    if not system or not instruction:
        return jsonify({'error': 'Missing system or instruction'}), 400

    response = generate_text(system, instruction, input_text)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(port=5000)
