import * as fs from 'fs';
import { ChromaClient } from 'chromadb'
import { createEmbedder } from '../../../shared/embedder';

type Paper = {
  title: string,
  abstract: string,
  relevancy?: number
};

const pathRefPapers: string = '/Users/spankyed/Develop/Projects/CurateGPT/services/database/generated/research-papers.json';
let ref_papers: Paper[] = JSON.parse(fs.readFileSync(pathRefPapers, 'utf-8'));

function computeCosineSimilarity(A: number[], B: number[]): number {
    if (A.length !== B.length) {
        throw new Error("Vectors must have the same length");
    }

    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < A.length; i++) {
        dot += A[i] * B[i];
        magA += A[i] * A[i];
        magB += B[i] * B[i];
    }

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    if (magA === 0 || magB === 0) {
        throw new Error("Magnitude of one of the vectors is zero");
    }

    return dot / (magA * magB);
}

async function testSimilarity(doc1: any) {
  const embedder = await createEmbedder();

  let [paper_embedding]: number[][] = await embedder.generate([doc1]); // Assuming encode returns an array of numbers.
  // console.log('paper_embedding: ', paper_embedding);

  let similarity_scores: number[] = [];

  for (let ref_paper of ref_papers) {
    let ref_paper_text: string = `${ref_paper.title}. ${ref_paper.abstract}`;
    const [ref_paper_embedding]: number[][] = await embedder.generate([ref_paper_text]);

    similarity_scores.push(computeCosineSimilarity(paper_embedding, ref_paper_embedding));
  }

  // Sort the scores and take the average of the top 5
  let top_5_scores: number[] = similarity_scores.sort((a, b) => b - a).slice(0, 5);
  let relevancy_score: number = top_5_scores.reduce((acc, val) => acc + val, 0) / top_5_scores.length;
  console.log('Manual \n -----------------');
  console.log('similarity_scores: ', similarity_scores);
  console.log('relevancy_score: ', relevancy_score);

}
async function testSimilarity2(doc1: any) {
  const embedder = await createEmbedder();

  let [paper_embedding]: number[][] = await embedder.generate([doc1]); // Assuming encode returns an array of numbers.
  const client = new ChromaClient();
  const collection = await client.getCollection({ name: 'paper-embeddings', embeddingFunction: embedder });
  const results = await collection.query({
    // queryTexts: paperTexts,
    queryEmbeddings: paper_embedding,
    nResults: 5,
  });
  // console.log('results: ', results);

  const relevancyScores = results.distances?.[0]
  ? results.distances?.[0]
  : [];
  // console.log('relevancyScores: ', relevancyScores);
  const avgRelevancy =
    relevancyScores.reduce((a, b) => a + b, 0) /
    (relevancyScores.length || 1);


  console.log('\nChroma \n -----------------');
  console.log('similarity_scores: ', relevancyScores);
  console.log('relevancy_score: ', 1 - avgRelevancy);
}

const docGood = "Defeasible Reasoning with Knowledge Graphs. Human knowledge is subject to uncertainties, imprecision, incompleteness and inconsistencies. Moreover, the meaning of many everyday terms is dependent on the context. That poses a huge challenge for the Semantic Web. This paper introduces work on an intuitive notation and model for defeasible reasoning with imperfect knowledge, and relates it to previous work on argumentation theory. PKN is to N3 as defeasible reasoning is to deductive logic. Further work is needed on an intuitive syntax for describing reasoning strategies and tactics in declarative terms, drawing upon the AIF ontology for inspiration. The paper closes with observations on symbolic approaches in the era of large language models.";
const docBad = "A matter of attitude: Focusing on positive and active gradients to boost saliency maps. Saliency maps have become one of the most widely used interpretability techniques for convolutional neural networks (CNN) due to their simplicity and the quality of the insights they provide. However, there are still some doubts about whether these insights are a trustworthy representation of what CNNs use to come up with their predictions. This paper explores how rescuing the sign of the gradients from the saliency map can lead to a deeper understanding of multi-class classification problems. Using both pretrained and trained from scratch CNNs we unveil that considering the sign and the effect not only of the correct class, but also the influence of the other classes, allows to better identify the pixels of the image that the network is really focusing on. Furthermore, how occluding or altering those pixels is expected to affect the outcome also becomes clearer."
const docVeryBad = "Can political gridlock undermine checks and balances? A lab experiment. If checks and balances are aimed at protecting citizens from the government's abuse of power, why do they sometimes weaken them? We address this question in a laboratory experiment in which subjects choose between two decision rules: with and without checks and balances. Voters may prefer an unchecked executive if that enables a reform that, otherwise, is blocked by the legislature. Consistent with our predictions, we find that subjects are more likely to weaken checks and balances when there is political gridlock. However, subjects weaken the controls not only when the reform is beneficial but also when it is harmful."

// testSimilarity(docGood)
testSimilarity(docBad)
// testSimilarity(docVeryBad)
// testSimilarity2(docGood)
testSimilarity2(docBad)
// testSimilarity2(docVeryBad)