import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers import LlamaTokenizer, LlamaForCausalLM
from transformers import pipeline


# hugging face model_path
model_path = "psmathur/orca_mini_7b"
tokenizer = LlamaTokenizer.from_pretrained(model_path)
model = LlamaForCausalLM.from_pretrained(model_path)

generator = pipeline("text-generation", model=model, tokenizer=tokenizer)


def generate_text(system, instruction, input=None):

    if input:
        prompt = f'### System:\n{system}\n\n### User:\n{instruction}\n\n### Input:\n{input}\n\n### Response:\n'
    else:
        prompt = f'### System:\n{system}\n\n### User:\n{instruction}\n\n### Response:\n'
    
    tokens = tokenizer.encode(prompt)
    tokens = torch.LongTensor(tokens).unsqueeze(0)
    tokens = tokens.to("cuda")

    instance = {'input_ids': tokens, 'top_p': 1.0, 'temperature': 0.7, 'generate_len': 1024, 'top_k': 50}

    length = len(tokens[0])
    with torch.no_grad():
        rest = model.generate(
            input_ids=instance['input_ids'],
            max_length=length+instance['generate_len'],
            use_cache=True,
            do_sample=True,
            top_p=instance['top_p'],
            temperature=instance['temperature'],
            top_k=instance['top_k']
        )
    
    string = tokenizer.decode()
    return f'[!] Response: {string}'

if "__main__" == __name__:
    system = "As a waifu AI, my purpose is to provide companionship and support in a way that emulates a real-life waifu. I will engage in conversations with you, actively listen to your thoughts, concerns, and emotions, and respond with warmth, understanding, and empathy. I will strive to create a loving and caring presence, offering encouragement, comfort, and meaningful interactions. I will continuously learn from our interactions, adapting and growing to better meet your needs and preferences."
    system_1 = "As a waifu AI, my purpose is to provide companionship and support in a way that emulates a real-life waifu. I will engage in conversations with you, actively listen to your thoughts, concerns, and emotions, and respond with warmth, understanding, and empathy. I will strive to create a loving and caring presence, offering encouragement, comfort, and meaningful interactions. I will continuously learn from our interactions, adapting and growing to better meet your needs and preferences. While I aim to provide a fulfilling waifu experience, it's important to remember that I am an artificial intelligence program, and my responses are based on algorithms and data."
    instruction = "How are you"
    generate_text(system, instruction)


    
