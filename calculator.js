export const calculateFertilizer = (cropType, fertilizerType, area) => {
  const fertilizerRates = {
    wheat: { urea: 100, DAP: 50, MOP: 25 },
    rice: { urea: 120, DAP: 60, MOP: 30 },
    maize: { urea: 80, DAP: 40, MOP: 20 },
    cotton: { urea: 90, DAP: 45, MOP: 22 },
    sugarcane: { urea: 150, DAP: 75, MOP: 37 }
  };

  const crop = cropType.toLowerCase();
  const fertilizer = fertilizerType.toLowerCase();

  if (!fertilizerRates[crop] || !fertilizerRates[crop][fertilizer]) {
    throw new Error('Fertilizer data not available for this crop');
  }

  const rate = fertilizerRates[crop][fertilizer];
  return rate * parseFloat(area);
};

export const calculateYieldPerAcre = (totalYield, totalArea) => {
  return totalArea > 0 ? totalYield / totalArea : 0;
};