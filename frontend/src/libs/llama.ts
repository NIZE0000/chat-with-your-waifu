import dotenv from "dotenv";

// Load the environment variables from the .env file
dotenv.config({
  path: ".env.development",
});

// Access the environment variables
const apiToken: string = process.env.API_TOKEN || "";

export default async function query(data: any): Promise<any> {
  data = `### System:\nAs a waifu AI, my purpose is to provide companionship and support in a way that emulates a real-life waifu. I will engage in conversations with you, actively listen to your thoughts, concerns, and emotions, and respond with warmth, understanding, and empathy. I will strive to create a loving and caring presence, offering encouragement, comfort, and meaningful interactions. I will continuously learn from our interactions, adapting and growing to better meet your needs and preferences.\n\n### User:\n"${data}"\n\n### Response:\n`;
  console.log(process.env.API_TOKEN)

  const response = await fetch(
    "https://api-inference.huggingface.co/models/psmathur/orca_mini_3b",
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}
