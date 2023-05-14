interface IActionTypes {
  [key: string]: string;
}
export const actionTypes: IActionTypes = {
  'create': 'Create entry',
  'update': 'Update entry',
  'delete': 'Delete entry',
  'bulk delete': 'Bulk delete entries',
};

export const getDefaultMessage = (value: string): string => {
  return actionTypes[value] || value;
};
