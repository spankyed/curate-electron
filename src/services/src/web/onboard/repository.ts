// Assuming PaperRecord matches the structure of your PapersTable model
// import { FindOptions, Op } from 'sequelize'
import { DatesTable, PapersTable, ReferencePapersTable } from '../../shared/schema'

// Fetch all stored dates
function getDates(dates: string[], status?: string) {
  return DatesTable.findAll({
    raw: true,
    where: {
      value: dates,
      ...(status && { status })
    }
  })
}

function getDate(date: string) {
  return DatesTable.findOne({
    where: {
      value: date
    }
  })
}

function getAllDates() {
  return DatesTable.findAll()
}

async function getLatestDate() {
  const lastDateRecord = await DatesTable.findOne({
    order: [['value', 'DESC']]
  })

  return lastDateRecord ? lastDateRecord.value : null
}

async function storeDate(date: string) {
  const existingDate = await DatesTable.findOne({
    where: {
      value: date
    }
  })

  if (!existingDate) {
    return await DatesTable.create({ value: date, status: 'pending' })
  }

  return existingDate
}

async function storeDates(dates: string[]): Promise<DatesTable[]> {
  const newDateRecords = dates.map((date) => ({
    value: date,
    status: 'pending'
  }))

  let results: DatesTable[] = []
  if (newDateRecords.length > 0) {
    results = await DatesTable.bulkCreate(newDateRecords, {
      ignoreDuplicates: true
    })
  }

  return results
}

function storeReferencePapers(paperIds: string[]): Promise<any> {
  const referenceRecords = paperIds.map((id) => ({ id }))

  return ReferencePapersTable.bulkCreate(referenceRecords, {
    ignoreDuplicates: true
  })
}

async function getReferencePapers() {
  const paperIds = await ReferencePapersTable.findAll()

  return PapersTable.findAll({
    where: {
      id: paperIds
    }
  })
}

export default {
  getDate,
  getDates,
  getAllDates,
  getLatestDate,
  storeDate,
  storeDates,
  storeReferencePapers,
  getReferencePapers
}
