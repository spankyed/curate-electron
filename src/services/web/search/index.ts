import * as repository from './repository';

async function searchPapers(formData){
  const papers = await repository.searchPapers(formData);
  
  return papers
}

export default {
  'search-papers': searchPapers,
}
