// import { pipeline, env } from "@xenova/transformers";

// env.localModelPath = "/Users/spankyed/develop/projects/all-models";
const MODEL_NAME = "Xenova/all-MiniLM-L6-v2";

// type Embedder = { generate: (texts: string[]) => Promise<number[][]> }

// createSBertEmbeddingFunction
export async function createEmbedder() {
  // const extractor = await pipeline("feature-extraction", MODEL_NAME, {
  //   quantized: false,
  // });
  const extractor = ()=>{}

  const generate = async (texts: string[]): Promise<number[][]> => {
    const embeddings: number[][] = await Promise.all(
      texts.map(async (text) => {
        const output = await extractor(text, {
          pooling: "mean",
          normalize: true,
        });
        return Array.from(output.data) as number[];
      })
    );
    return embeddings;
  };

  return { generate };
}


