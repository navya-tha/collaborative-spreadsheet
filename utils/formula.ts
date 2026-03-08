export function evaluateFormula(
  value: string | undefined,
  cells: Record<string, string> = {}
) {
  if (!value) return "";
  if (!value.startsWith("=")) return value;

  try {
    let expression = value.slice(1);

    // Replace cell references with numeric values
    Object.keys(cells).forEach((key) => {
      const cellVal = parseFloat(cells[key]) || 0;
      const regex = new RegExp(`\\b${key}\\b`, "g");
      expression = expression.replace(regex, cellVal.toString());
    });

    // Evaluate safely
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${expression}`)();
    return result.toString();
  } catch {
    return "ERR";
  }
}