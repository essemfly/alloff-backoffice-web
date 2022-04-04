export type AutocompleteItem = {
  key: string;
  label: string;
  value: string;
  subvalue?: string;
};

export const findMatches = (
  options: AutocompleteItem[],
  searchTerm: string,
) => {
  const keyword = searchTerm.toLowerCase();
  return options.filter(({ key, label, value, subvalue }) => {
    const keyMatch = key.toLowerCase().indexOf(keyword) > -1;
    const labelMatch = label.toLowerCase().indexOf(keyword) > -1;
    const valueMatch = value.toLowerCase().indexOf(keyword) > -1;
    const subvalueMatch = subvalue
      ? subvalue.toLowerCase().indexOf(keyword) > -1
      : false;

    return keyMatch || labelMatch || valueMatch || subvalueMatch;
  });
};

export const spanWrapSearchTerm = (
  target: string,
  foundIndex: number,
  searchTermLength: number,
) => {
  const searchTerm = target.slice(foundIndex, foundIndex + searchTermLength);

  return `<span>${searchTerm}</span>`;
};

export const boldSearchTerm = (target: string, searchTerm: string) => {
  const lowercaseOption = target.toLowerCase();
  const lowercaseSearchTerm = searchTerm.toLowerCase();
  let foundIndex = lowercaseOption.indexOf(lowercaseSearchTerm);
  let html = "";

  if (!searchTerm) return target;

  while (foundIndex !== -1) {
    const previousIndex = foundIndex;
    const searchTermLength = searchTerm.length;

    if (!html) {
      html = target.slice(0, foundIndex);
    }

    html += spanWrapSearchTerm(target, foundIndex, searchTermLength);

    // check for another match
    foundIndex = lowercaseOption.indexOf(lowercaseSearchTerm, foundIndex + 1);

    if (foundIndex !== -1) {
      // second match: add raw string before next section of html
      html += target.slice(previousIndex + searchTermLength, foundIndex);
    } else {
      // single match, finish the string
      html += target.slice(previousIndex + searchTermLength);
    }
  }

  return html || target;
};
