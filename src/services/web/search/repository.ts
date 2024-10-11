import { Op } from 'sequelize';
import { PapersTable } from '../../shared/schema';

export interface Paper {
  id: string;
  date: string;
  title: string;
  abstract: string;
  authors: string;
  status: number;
  relevancy: number;
  isStarred: boolean;
  keywords: string;
}

interface SearchForm {
  query?: string;
  queryField: string;
  favorite?: boolean;
  viewed?: boolean;
  relevancy?: {
    operator: string;
    value: number;
  };
  dateStart?: string | null;
  dateEnd?: string | null;
  initialState?: boolean;
  approvedState?: boolean;
  generatedState?: boolean;
  publishedState?: boolean;
}

async function searchPapers(form: SearchForm): Promise<Paper[]> {
  let whereClause: { [key: string]: any } = {};

  if (form.query) {
    if (form.queryField === 'all') {
      whereClause = {
        [Op.or]: [
          { title: { [Op.like]: `%${form.query}%` } },
          { abstract: { [Op.like]: `%${form.query}%` } },
          { authors: { [Op.like]: `%${form.query}%` } },
          // { keywords: { [Op.like]: `%${form.query}%` } },
        ],
      };
    } else {
      whereClause[form.queryField] = { [Op.like]: `%${form.query}%` };
    }
  }

  if (form.favorite) {
    whereClause.isStarred = 1;
  }

  // if (form.viewed !== undefined) {
  //   // not implemented
  // }

  if (form.relevancy && form.relevancy.value) {
    const operator = form.relevancy.operator === '≥' ? Op.gte : Op.lte;
    whereClause.relevancy = { [operator]: form.relevancy.value / 100 };
  }

  if (form.dateStart) {
    whereClause.date = { [Op.gte]: form.dateStart };
  }

  if (form.dateEnd) {
    whereClause.date = { ...(whereClause.date || {}), [Op.lte]: form.dateEnd };
  }

  if (form.initialState || form.approvedState || form.generatedState || form.publishedState) {
    whereClause.status = [];
    if (form.initialState) whereClause.status.push(0); // Assuming status '0' means initial
    if (form.approvedState) whereClause.status.push(1); // Assuming status '1' means approved
    if (form.generatedState) whereClause.status.push(2); // Assuming status '2' means generated
    if (form.publishedState) whereClause.status.push(3); // Assuming status '3' means published
    if (whereClause.status.length > 0) {
      whereClause.status = { [Op.in]: whereClause.status };
    } else {
      delete whereClause.status;
    }
  }

  try {
    const papers = await PapersTable.findAll({
      where: whereClause,
      order: [
        ['isStarred', 'DESC'],
        ['relevancy', 'DESC'],
      ],
      limit: 1000,
      raw: true,
    });
    return papers;
  } catch (error) {
    console.error('Error searching papers:', error);
    throw error;
  }
}

export { searchPapers };
