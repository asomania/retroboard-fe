/**
 * @param {any} data
 * @returns {{ id: string, title: string, tagline: string, items: Array }[]}
 */
const buildColumns = (data) => {
  const defaults = [
    { id: "start", title: "Başlangıç", tagline: "Kutla", items: [] },
    { id: "stop", title: "Durdur", tagline: "Öğren", items: [] },
    { id: "continue", title: "Devam et", tagline: "Harekete geç", items: [] },
  ];

  if (Array.isArray(data?.columns) && data.columns.length) {
    return data.columns.slice(0, 3).map((column, index) => ({
      id: column.id || `col-${index}`,
      title: column.title || defaults[index]?.title || `Sütun ${index + 1}`,
      tagline: defaults[index]?.tagline || "Kartlar",
      items: Array.isArray(column.cards) ? column.cards : [],
    }));
  }

  return defaults;
};

export { buildColumns };
