import { Atom, atom } from 'jotai';
import { Paper } from '../utils/types';
// import * as api from '../api/fetch';

export const selectedDateAtom = atom<string>('');
export const emptyListAtom = atom([]);
export const emptyObjectAtom = atom<any>({});

// interface ListItem {
//   id: number;
//   [key: string]: any;
// }

interface UpdateListItemParams {
  papersListAtom: Atom<Paper[]>;
  id: string;
  field: string;
  newValue: any 
}
interface UpdateItemParams {
  paperAtom: Atom<Paper | undefined>;
  id: string;
  field: string;
  newValue: any 
}

export const updatePaperAtom = atom(
  null,
  (get, set, { paperAtom, id, field, newValue }: UpdateItemParams) => {
    const item = get(paperAtom);

    set(paperAtom as any, { ...item, [field]: newValue });
  }
);

export const updatePaperInListAtom = atom(
  null,
  (get, set, { papersListAtom, id, field, newValue }: UpdateListItemParams) => {
    const papersList = get(papersListAtom);
    const updatedItemList = papersList.map(item =>
      item.id === id ? { ...item, [field]: newValue } : item
    );

    set(papersListAtom as any, updatedItemList);
  }
);

