import "dotenv/config";
import { Midjourney } from "midjourney";

// todo shorten prompt
// generate multiple prompts and pool for best prompt

// todo imagine and upscale first variation
// ? will need to return all variations for review
// todo allow for reroll

/**
 *
 * a simple example of using the imagine api with ws
 * ```
 * npx tsx example/imagine-ws.ts
 * ```
 */

// Main function
async function main() {
  // Creating a new Midjourney client with the necessary configurations
  const client = new Midjourney({
    ServerId: <string>process.env.SERVER_ID, // Server ID from environment variables
    ChannelId: <string>process.env.CHANNEL_ID, // Channel ID from environment variables
    SalaiToken: <string>process.env.SALAI_TOKEN, // Salai Token from environment variables
    HuggingFaceToken: <string>process.env.HUGGINGFACE_TOKEN, // Hugging Face Token from environment variables
    // Debug: true, // Enable debugging
    Ws: true, // Enable WebSocket
  });

  await client.Connect();

  const prompt = "AI Brainstorm, Mining, Business";

  // Using the Imagine method of the client
  const Imagine = await client.Imagine(prompt, (uri: string, progress: string) => { // Callback function for loading
    console.log("Imagine.loading", uri, "progress", progress); // Logging the progress
  });

  console.log({ Imagine });

  if (!Imagine) {
    return;
  }

  // const Upscale = await client.Upscale({
  //   index: 1, // Index for the Upscale method
  //   msgId: <string>Imagine.id, // Message ID from the Imagine result
  //   hash: <string>Imagine.hash, // Hash from the Imagine result
  //   flags: Imagine.flags, // Flags from the Imagine result
  //   loading: (uri: string, progress: string) => { // Callback function for loading
  //     console.log("Upscale.loading", uri, "progress", progress); // Logging the progress
  //   },
  // });

  // console.log({ Upscale });

  // const reroll = await client.Reroll({
  //   msgId: <string>Imagine.id, // Message ID from the Imagine result
  //   hash: <string>Imagine.hash, // Hash from the Imagine result
  //   flags: Imagine.flags, // Flags from the Imagine result
  //   loading: (uri: string, progress: string) => { // Callback function for loading
  //     console.log("Reroll.loading", uri, "progress", progress); // Logging the progress
  //   },
  // });

  // console.log({ reroll });

  // const Variation = await client.Variation({
  //   index: 2, // Index for the Variation method
  //   msgId: <string>Imagine.id, // Message ID from the Imagine result
  //   hash: <string>Imagine.hash, // Hash from the Imagine result
  //   flags: Imagine.flags, // Flags from the Imagine result
  //   loading: (uri: string, progress: string) => { // Callback function for loading
  //     console.log("Variation.loading", uri, "progress", progress); // Logging the progress
  //   },
  // });

  // console.log({ Variation });

  // if (!Variation) {
  //   return;
  // }

  // const Upscale = await client.Upscale({
  //   index: 2, // Index for the Upscale method
  //   msgId: <string>Variation.id, // Message ID from the Variation result
  //   hash: <string>Variation.hash, // Hash from the Variation result
  //   flags: Variation.flags, // Flags from the Variation result
  //   loading: (uri: string, progress: string) => { // Callback function for loading
  //     console.log("Upscale.loading", uri, "progress", progress); // Logging the progress
  //   },
  // });

  // console.log({ Upscale });

  client.Close();
}

main()
  .then(() => {
    console.log("finished");
    process.exit(0);
  })
  .catch((err) => {
    console.log("finished");
    console.error(err);
    process.exit(1);
  }); 
