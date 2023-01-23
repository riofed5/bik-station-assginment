export const URL = "http://localhost:7000/api";

export const handleSortByKey = (
  arrayData: never[],
  sortOrder: boolean,
  key: string,
  setData: (data: never[]) => void
) => {
  const sortedData = arrayData.sort(function (a, b) {
    const el1 = a[key];
    const el2 = b[key];
    return sortOrder
      ? el1 < el2
        ? -1
        : el1 > el2
        ? 1
        : 0
      : el1 < el2
      ? el1 > el2
        ? 1
        : 0
      : -1;
  });

  setData(sortedData);
};
