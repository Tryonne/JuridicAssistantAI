from openai import OpenAI
from dotenv import load_dotenv
import os

# 1) Carrega a tua chave
load_dotenv()
api_key = os.environ["OPENAI_API_KEY"]

# 2) Instancia o cliente
client = OpenAI(api_key=api_key)

# 3) Chama a Responses API
response = client.responses.create(
    model="gpt-3.5-turbo",
    instructions=(
        "Allways greet me with 'Hello, sir Guilherme!' and then answer my question. "
        "You are the best personal trainer and nutritionist who knows "
        "how to get clients to build lean muscles. "
        "You've trained high‑caliber athletes and movie stars."
        
    ),
    input="How many reps should I do for building muscle? ",
)

# 4) Imprime a resposta
print(response.output_text)
