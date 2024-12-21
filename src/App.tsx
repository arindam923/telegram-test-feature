import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";

const SpinningWheel = () => {
  const [numSegments, setNumSegments] = useState(30);
  const [difficulty, setDifficulty] = useState("medium");
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const generateWheelData = (numSegments: number, difficulty: string) => {
    const grayColor = "#4B5563";
    const greenColor = "#22C55E";
    const yellowColor = "#EAB308";
    const purpleColor = "#7C3AED";
    const orangeColor = "#F97316";

    const multipliers = {
      easy: [0, 1.5, 1.5, 1.5, 2, 2, 2, 1.7],
      medium: [0, 1.5, 1.5, 2, 2, 3, 1.7],
    };

    const selectedMultipliers = multipliers[difficulty];
    const nonGrayColors = [greenColor, yellowColor, purpleColor, orangeColor];

    // Initialize segments array
    let segments = [];

    // Calculate number of color-gray pairs we need
    // Every third segment will be a color (color-gray-color pattern)
    const numberOfColorSegments = Math.floor(numSegments / 2);

    // Create pattern array: [color, gray, color, gray, ...]
    for (let i = 0; i < numSegments; i++) {
      let multiplier;
      if (i % 2 === 0) {
        // This will be a colored segment
        // Use non-zero multipliers for colored segments
        const nonZeroMultipliers = selectedMultipliers.filter((m) => m !== 0);
        multiplier =
          nonZeroMultipliers[
            Math.floor(Math.random() * nonZeroMultipliers.length)
          ];
      } else {
        // This will be a gray segment
        multiplier = 0; // Gray segments always have multiplier 0
      }

      segments.push({
        option: multiplier + "x",
        multiplier: multiplier,
        style: {
          backgroundColor:
            i % 2 === 0
              ? nonGrayColors[Math.floor(Math.random() * nonGrayColors.length)]
              : grayColor,
        },
      });
    }

    // Ensure no same colored segments are adjacent (including wrap-around)
    for (let i = 0; i < segments.length; i += 2) {
      if (i > 0) {
        // Check previous colored segment
        const prevColoredIndex = (i - 2 + segments.length) % segments.length;
        while (
          segments[i].style.backgroundColor ===
          segments[prevColoredIndex].style.backgroundColor
        ) {
          segments[i].style.backgroundColor =
            nonGrayColors[Math.floor(Math.random() * nonGrayColors.length)];
        }
      }
    }

    return segments;
  };

  const [wheelData, setWheelData] = useState(
    generateWheelData(numSegments, difficulty)
  );

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * wheelData.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleDifficultyChange = (e: any) => {
    const newDifficulty = e.target.value;
    setDifficulty(newDifficulty);
    setWheelData(generateWheelData(numSegments, newDifficulty));
  };

  const handleSegmentsChange = (e: any) => {
    const newNumSegments = parseInt(e.target.value);
    setNumSegments(newNumSegments);
    setWheelData(generateWheelData(newNumSegments, difficulty));
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-900">
      <div className="flex gap-4 mb-4">
        <select
          value={difficulty}
          onChange={handleDifficultyChange}
          className="px-4 py-2 border rounded-md bg-gray-800 text-white border-gray-700"
        >
          <option value="medium">Medium</option>
          <option value="easy">Easy</option>
        </select>

        <select
          value={numSegments}
          onChange={handleSegmentsChange}
          className="px-4 py-2 border rounded-md bg-gray-800 text-white border-gray-700"
        >
          {[10, 20, 30, 40, 50].map((num) => (
            <option key={num} value={num}>
              {num} segments
            </option>
          ))}
        </select>
      </div>

      <div className="w-full h-96 relative">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          onStopSpinning={() => {
            setMustSpin(false);
          }}
          textColors={["white"]}
          fontSize={14}
          radiusLineWidth={1}
          radiusLineColor="#1F2937"
          outerBorderWidth={0}
          innerBorderWidth={0}
          innerRadius={90}
          spinDuration={0.8}
        />
      </div>

      <button
        onClick={handleSpinClick}
        disabled={mustSpin}
        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-600 mt-4"
      >
        {mustSpin ? "Spinning..." : "Spin Wheel"}
      </button>

      <div className="mt-4 text-sm text-white">
        <div className="flex flex-wrap gap-4">
          <div>Gray (0x)</div>
          <div>Green (1.5x)</div>
          <div>Yellow (2x)</div>
          <div>Purple (3x)</div>
          <div>Orange (1.7x)</div>
        </div>
      </div>
    </div>
  );
};

export default SpinningWheel;
