export function selectAgent(input: string): string {
  const text = input.toLowerCase();
  if (text.includes("risk") || text.includes("danger") || text.includes("threat")) return "risk";
  if (text.includes("idea") || text.includes("create") || text.includes("imagine")) return "creative";
  if (text.includes("plan") || text.includes("steps") || text.includes("execute")) return "execution";
  return "logic";
}
