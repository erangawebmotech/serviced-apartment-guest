import React, { useState } from "react";

const PriceRangeAndChart: React.FC = () => {
    const initialMinPrice = 0;
    const initialMaxPrice = 20000;

    const [sliderMinValue] = useState<number>(initialMinPrice);
    const [sliderMaxValue] = useState<number>(initialMaxPrice);
    const [minVal, setMinVal] = useState<number>(initialMinPrice);
    const [maxVal, setMaxVal] = useState<number>(initialMaxPrice);


    return (
        <div className="flex flex-col justify-center items-center pb-3 w-full">
          

            <div className="left-1 relative double-slider-box">
                
                <div className="top-3 -left-1 relative flex justify-between items-center input-box">

                    <div>
                       
                        <input
                            className="!px-2 !py-4 border border-primary border-opacity-40 !rounded-2xl min-w-20 !max-w-32 !text-sm text-center"
                            type="text"
                            value={`$${minVal}`}
                            onChange={(e) => {
                                const value = parseInt(e.target.value.replace(/\D/g, ""), 10);
                                if (!isNaN(value) && value >= sliderMinValue && value < maxVal - 5) {
                                    setMinVal(value);
                                }
                            }}
                            min={sliderMinValue}
                            max={maxVal - 5}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            className="!px-2 !py-4 border border-primary border-opacity-40 !rounded-2xl min-w-20 !max-w-32 !text-sm text-center"
                            value={maxVal === sliderMaxValue ? `$${maxVal}+` : `$${maxVal}`}
                            onChange={(e) => {
                                const value = parseInt(e.target.value.replace(/\D/g, ""), 10);
                                if (!isNaN(value) && value > minVal + 5 && value <= sliderMaxValue) {
                                    setMaxVal(value);
                                }
                            }}
                            min={minVal + 5}
                            max={sliderMaxValue}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PriceRangeAndChart;
