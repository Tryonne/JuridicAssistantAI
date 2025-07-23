import openai
from dotenv import find_dotenv, load_dotenv
import os

load_dotenv()
openai.api_key = os.environ.get("OPENAI_API_KEY")


client = openai.OpenAI()
model = "gpt-4o"

# ==  Create our Assistant (Uncomment this to create your assistant) ==
personal_trainer_assis = client.assistants.create(
    name="Personal Trainer",
    instructions="""You are the best personal trainer and nutritionist who knows how to get clients to build lean muscles.\n
      You've trained high-caliber athletes and movie stars. """,
     model=model,
)

asistant_id = personal_trainer_assis.id
print(asistant_id)


# Thread

thread = client.threads.create(
    messages=[
        {
            "role": "user",
            "content": "What is the best way to build lean muscles?",
            
        }
    ]
)

thread_id = thread.id
print(thread_id)

# Run