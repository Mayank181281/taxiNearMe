import React, { useState } from "react";
import {
  processExpiredAds,
  getExpiredAdsForProcessing,
  ExpiredAdProcessResult,
} from "../../services/adExpirationService";

interface ExpiredAd {
  id: string;
  title: string;
  tag: string;
  status: string;
  approved: boolean;
  expiryDate?: Date;
  userId: string;
}

const AdExpirationManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [expiredAds, setExpiredAds] = useState<ExpiredAd[]>([]);
  const [processResult, setProcessResult] =
    useState<ExpiredAdProcessResult | null>(null);

  const handlePreview = async () => {
    setLoading(true);
    setPreviewMode(true);
    try {
      const ads = await getExpiredAdsForProcessing();
      setExpiredAds(ads);
      console.log("Expired ads for processing:", ads);
    } catch (error) {
      console.error("Error fetching expired ads:", error);
      alert("Error fetching expired ads. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessExpiredAds = async () => {
    if (
      !window.confirm(
        `This will downgrade ${expiredAds.length} expired VIP/VIP Prime ads to Free ads. Continue?`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const result = await processExpiredAds();
      setProcessResult(result);

      // Refresh the preview
      const updatedAds = await getExpiredAdsForProcessing();
      setExpiredAds(updatedAds);

      alert(`Processing complete! ${result.processedCount} ads downgraded.`);
    } catch (error) {
      console.error("Error processing expired ads:", error);
      alert("Error processing expired ads. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">🔄 Ad Expiration Manager</h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • <strong>VIP Prime (expired)</strong> → Automatically becomes{" "}
            <strong>Free Ad</strong>
          </li>
          <li>
            • <strong>VIP (expired)</strong> → Automatically becomes{" "}
            <strong>Free Ad</strong>
          </li>
          <li>
            • <strong>Free Ads</strong> → Never expire, remain active
          </li>
          <li>
            • <strong>No ads are deleted</strong> - only downgraded
          </li>
          <li>
            • Users can upgrade their Free ads back to VIP/VIP Prime anytime
          </li>
        </ul>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handlePreview}
          disabled={loading}
          className={`px-4 py-2 rounded text-white font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading && previewMode ? "Loading..." : "🔍 Preview Expired Ads"}
        </button>

        {expiredAds.length > 0 && (
          <button
            onClick={handleProcessExpiredAds}
            disabled={loading}
            className={`px-4 py-2 rounded text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {loading && !previewMode
              ? "Processing..."
              : `⬇️ Process ${expiredAds.length} Expired Ads`}
          </button>
        )}
      </div>

      {/* Preview Results */}
      {expiredAds.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">
            📋 Expired Ads to Process ({expiredAds.length})
          </h3>
          <div className="max-h-60 overflow-y-auto bg-gray-50 rounded-lg p-4">
            {expiredAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-white p-3 mb-2 rounded border text-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div>
                      <strong>Title:</strong> {ad.title}
                    </div>
                    <div>
                      <strong>Type:</strong>
                      <span
                        className={`ml-1 px-2 py-1 rounded text-xs ${
                          ad.tag === "vip-prime"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {ad.tag === "vip-prime" ? "VIP Prime" : "VIP"}
                      </span>
                    </div>
                    <div>
                      <strong>Expired:</strong>{" "}
                      {ad.expiryDate?.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-600 text-xs">Expired</div>
                    <div className="text-green-600 text-xs">
                      → Will become Free
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {expiredAds.length === 0 && previewMode && (
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-green-800">
            ✅ No expired VIP/VIP Prime ads found!
          </div>
          <div className="text-sm text-green-600 mt-1">
            All premium ads are still active or have already been processed.
          </div>
        </div>
      )}

      {/* Processing Results */}
      {processResult && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">
            ✅ Processing Results
          </h3>
          <div className="text-sm text-green-800">
            <div>
              • <strong>{processResult.processedCount}</strong> ads successfully
              downgraded to Free
            </div>
            {processResult.errors.length > 0 && (
              <div className="text-red-600 mt-2">
                • <strong>{processResult.errors.length}</strong> errors occurred
              </div>
            )}
          </div>

          {processResult.downgradedAds.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-green-700 font-medium">
                View Downgraded Ads ({processResult.downgradedAds.length})
              </summary>
              <div className="mt-2 max-h-32 overflow-y-auto bg-white p-2 rounded">
                {processResult.downgradedAds.map((ad) => (
                  <div key={ad.id} className="text-xs py-1">
                    {ad.title} ({ad.originalTag} → {ad.newTag})
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

export default AdExpirationManager;
