import React, { useState } from "react";

const PriceRangeAndChartMobile: React.FC = () => {
  const initialMinPrice = 25;
  const initialMaxPrice = 100000;

  const [minVal, setMinVal] = useState<number>(initialMinPrice);
  const [maxVal, setMaxVal] = useState<number>(initialMaxPrice);
  const [minInput, setMinInput] = useState<string>(initialMinPrice.toString());
  const [maxInput, setMaxInput] = useState<string>(initialMaxPrice.toString());

  const handleMinBlur = () => {
    const parsed = Number(minInput);
    if (!isNaN(parsed) && parsed >= initialMinPrice && parsed <= maxVal - 5) {
      setMinVal(parsed);
    }
    setMinInput(() => minVal.toString()); // reset input to valid value
  };

  const handleMaxBlur = () => {
    const parsed = Number(maxInput);
    if (!isNaN(parsed) && parsed <= initialMaxPrice && parsed >= minVal + 5) {
      setMaxVal(parsed);
    }
    setMaxInput(() => maxVal.toString()); // reset input to valid value
  };

  return (
    <div className="flex items-center gap-2 mt-5">
      <div className="flex flex-col items-center">
        <label className="mb-1 text-xs">Min Price</label>
        <input
          type="number"
          className="px-2 py-2 border rounded-2xl min-w-20 text-xs text-center"
          value={minInput}
          onChange={(e) => setMinInput(e.target.value)}
          onBlur={handleMinBlur}
          min={initialMinPrice}
          max={maxVal - 5}
        />
      </div>

      <div className="flex flex-col items-center">
        <label className="mb-1 text-xs">Max Price</label>
        <input
          type="number"
          className="px-2 py-2 border rounded-2xl min-w-20 text-xs text-center"
          value={maxInput}
          onChange={(e) => setMaxInput(e.target.value)}
          onBlur={handleMaxBlur}
          min={minVal + 5}
          max={initialMaxPrice}
        />
      </div>
    </div>
  );
};

export default PriceRangeAndChartMobile;
