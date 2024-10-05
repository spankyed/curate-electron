export const root = '/Users/spankyed/Develop/Projects/CurateGPT/services/';

export const ports = {
  client: 5173,
  web: 3000,
  worker: 6000,
  maintenance: 7000,
};

export const ClientPath = `http://localhost:${ports.client}`; // to allow web requests CORS
export const WebServerPath = `http://localhost:${ports.web}`;
export const WorkerPath = `http://localhost:${ports.worker}`;
export const MaintenancePath = `http://localhost:${ports.maintenance}`;

export const ReferenceCollectionName = "paper-embeddings";
// export const ReferenceCollectionName = "reference-papers";


// export const seedReferencePaperIds =  [
//   '2308.05481',
//   '2307.09909',
//   '2307.06159',
//   '2307.05082',
//   '2307.05300',
//   '2305.10601',
//   // '2307.05071', // Mining for Unknown Unknowns
//   '2307.01933',
//   '2307.01577',
//   '2307.01548',
//   '2307.01403',
//   '2307.01204',
//   '2307.02276',
//   '2307.02046',
//   '2307.02295',
//   // '2307.02243', // Power-up! What Can Generative Models Do for Human Computation Workflows? (Crowdsourcing AI)
//   // '2307.01951', // A Neural Collapse Perspective on Feature Evolution in Graph Neural Networks
//   '2307.01928',
//   '2307.02477',
//   '2307.02485',
//   '1801.07243v5',
//   // ---------------- claude
//   '2307.02390',
//   '2307.07255',
//   // '2307.06950', // Pathway toward prior knowledge-integrated machine learning in engineering
//   '2307.06917',
//   '2307.08962', // !
//   '2206.08853',
//   '2307.09364', // ? Local Minima Drive Communications in Cooperative Interaction
//   '2307.08859', // ? Curriculum Learning for Graph Neural Networks: A Multiview Competence-based Approach
//   '2307.09721',
//   '2210.02441',
//   '2307.10680',
//   // after sep 1
//   '2208.03299',
//   '2308.13916',
//   '2308.13724',
//   '2308.14296',
//   '2305.01157',
//   // latest
//   '2404.05966',
//   '2404.07439',
// ]
