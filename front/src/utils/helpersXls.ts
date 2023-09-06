const convertToCSV = (data: [{}]) => {
  const header = Object.keys(data[0]).join(",");
  const csv = data.map((item) => Object.values(item).join(",")).join("\n");
  return `${header}\n${csv}`;
};
export const generateCSVFile = (data: [{}]) => {
  const csvData = convertToCSV(data);
  const blob = new Blob([csvData], {
    type: "text/csv",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "data.csv";
  link.click();
  URL.revokeObjectURL(url);
};
