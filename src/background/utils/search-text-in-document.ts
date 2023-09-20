export const searchTextInDocument = (
  searchText: string,
  documentText: string
): null | string[] => {
  return documentText.match(new RegExp(searchText, 'gi'));
};
