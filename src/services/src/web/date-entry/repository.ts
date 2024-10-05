import { DatesTable, PapersTable } from "../../shared/schema";

function getDateByValue(value: string): Promise<any> {
  return DatesTable.findOne({
    where: { value },
    raw: true,
  });
}

export {
  getDateByValue
}
