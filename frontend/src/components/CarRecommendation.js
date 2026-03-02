import React, { useState } from "react";
import { getCarRecommendation } from "../api";
import "./carRecommendation.css";

const featureOptions = ["TV", "sunroof", "captain seat", "luxury"];

const CarRecommendation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [familySize, setFamilySize] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [sizePref, setSizePref] = useState("");
  const [budget, setBudget] = useState("");
  const [recommendedCar, setRecommendedCar] = useState(null);
  const [loading, setLoading] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleFeatureChange = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const result = await getCarRecommendation(familySize, selectedFeatures);
      setRecommendedCar(result.recommendedCar);
    } catch (error) {
      console.error("Recommendation error:", error);
      alert(error.message || "Failed to get recommendation");
    }
    setLoading(false);
    nextStep(); // move to result step
  };

  const handleStartOver = () => {
    setStep(1);
    setFamilySize("");
    setSelectedFeatures([]);
    setSizePref("");
    setBudget("");
    setRecommendedCar(null);
  };

  return (
    <>
        {/* Floating Chat Button */}
        <div className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "✖" : "💬"}
        </div>

        {/* Chatbot Popup */}
        {isOpen && (
            <div className="chatbot-popup">
            {step === 0 && (
                <>
                <div className="chatbot-bubble">
                    Hi! I can help you find the perfect car for our client.
                </div>
                <button onClick={nextStep}>Start</button>
                </>
            )}

            {step === 1 && (
                <>
                <div className="chatbot-bubble">How many seats does the client prefers?</div>
                <input
                    type="number"
                    min="1"
                    value={familySize}
                    onChange={(e) => setFamilySize(parseInt(e.target.value))}
                />
                <div className="button-row">
                    <button onClick={prevStep}>Back</button>
                    <button onClick={nextStep} disabled={!familySize}>Next</button>
                </div>
                </>
            )}

            {step === 2 && (
                <>
                <div className="chatbot-bubble">Which features does the client needed?</div>

                <div className="feature-list">
                {featureOptions.map((feature) => (
                    <label key={feature} className="feature-item">
                    <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => handleFeatureChange(feature)}
                    />
                    {feature}
                    </label>
                ))}
                </div>

                <div className="button-row">
                <button onClick={prevStep}>Back</button>
                <button onClick={nextStep}>Next</button>
                </div>
                </>
                )}

            {step === 3 && (
                <>
                <div className="chatbot-bubble">Does the client have a size preference? (Small, Medium, Large)</div>
                <select value={sizePref} onChange={(e) => setSizePref(e.target.value)}>
                    <option value="">No preference</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                </select>
                <div className="button-row">
                    <button onClick={prevStep}>Back</button>
                    <button onClick={nextStep}>Next</button>
                </div>
                </>
            )}

            {step === 4 && (
                <>
                <div className="chatbot-bubble">Does the client have a budget?</div>
                <input
                    type="number"
                    min="0"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                />
                <div className="button-row">
                    <button onClick={prevStep}>Back</button>
                    <button onClick={handleRecommend}>Get Recommendation</button>
                </div>
                </>
            )}

            {step === 5 && recommendedCar && (
                <>
                <div className="recommendation-result">
                    <strong>So I would recommend {recommendedCar.name} with reasons as follows:</strong>
                    <p>
                    Seats: {recommendedCar.min_seats}-{recommendedCar.max_seats}, Size: {recommendedCar.size}, Features:{" "}
                    {recommendedCar.features.length > 0 ? recommendedCar.features.join(", ") : "None"}
                    </p>
                </div>
                <button onClick={handleStartOver}>Start Over</button>
                </>
            )}
            </div>
        )}
    </>
  );
};

export default CarRecommendation;