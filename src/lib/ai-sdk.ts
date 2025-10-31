export function extractHealthInfo(aiResponse: string): Record<string, any> {
  // Simple extraction logic - in production, this would be more sophisticated
  const healthInfo: Record<string, any> = {};
  
  // Extract medications mentioned
  const medicationPatterns = /(?:taking|prescribed|medication|drug)\s+([A-Za-z]+)/gi;
  const medications = [];
  let match;
  while ((match = medicationPatterns.exec(aiResponse)) !== null) {
    medications.push(match[1]);
  }
  if (medications.length > 0) {
    healthInfo.medications = medications;
  }

  // Extract conditions mentioned
  const conditionPatterns = /(?:have|diagnosed with|suffer from|condition of|disease of)\s+((?:[A-Za-z]+\s?){1,3})/gi;
  const conditions = [];
  while ((match = conditionPatterns.exec(aiResponse)) !== null) {
    const condition = match[1].trim();
    if (condition) {
      conditions.push(condition);
    }
  }
  if (conditions.length > 0) {
    healthInfo.conditions = conditions;
  }

  return healthInfo;
}