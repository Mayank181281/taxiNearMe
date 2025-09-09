import React, { useState } from "react";
import {
  triggerImmediateExpiration,
  AutoExpirationResult,
} from "../../services/autoExpirationService";

const QuickExpirationProcessor: React.FC = () => {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<AutoExpirationResult | null>(null);

  const handleProcessExpiredAds = async () => {
    setProcessing(true);
    setResult(null);

    try {
      console.log("🔄 Starting immediate expiration processing...");
      const processingResult = await triggerImmediateExpiration();
      setResult(processingResult);

      if (processingResult.processedCount > 0) {
        alert(
          `✅ Success! ${processingResult.processedCount} expired ads converted to Free ads!`
        );
      } else {
        alert("ℹ️ No expired VIP/VIP Prime ads found to process.");
      }
    } catch (error) {
      console.error("❌ Error processing expired ads:", error);
      alert("❌ Error processing expired ads. Check console for details.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold mb-3">
        🚀 Quick Fix: Convert Expired Ads
      </h3>
      <p className="text-gray-600 mb-4">
        Click this button to immediately convert all expired VIP/VIP Prime ads
        to Free ads. This will make them visible again as Free ads.
      </p>

      <button
        onClick={handleProcessExpiredAds}
        disabled={processing}
        className={`px-6 py-2 rounded text-white font-medium ${
          processing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {processing ? "Processing..." : "🔄 Convert Expired Ads to Free"}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-900">
            ✅ Processing Complete!
          </h4>
          <div className="text-sm text-green-800 mt-2">
            <div>
              • <strong>{result.processedCount}</strong> ads converted to Free
            </div>
            {result.downgradedAds.length > 0 && (
              <div className="mt-2">
                <strong>Converted ads:</strong>
                <ul className="ml-4 mt-1">
                  {result.downgradedAds.map((ad) => (
                    <li key={ad.id} className="text-xs">
                      • {ad.title} ({ad.originalTag} → free)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="text-xs text-green-600 mt-2">
            ✅ These ads are now visible as Free ads and users can upgrade them
            back to premium anytime!
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickExpirationProcessor;
