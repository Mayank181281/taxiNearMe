import React, { useState } from "react";
import {
  checkExpiredAds,
  checkFirebaseTTLFeatures,
} from "../utils/checkExpiredAds";

interface ExpiredAdResult {
  hasExpiredAds: boolean;
  expiredCount: number;
  totalAds?: number;
  adsWithExpiry?: number;
  futureExpiryAds?: number;
  expiredAds?: Array<{
    id: string;
    title: string;
    tag: string;
    status: string;
    approved: boolean;
    expiryDate?: Date;
  }>;
  error?: string;
}

const ExpiredAdsChecker: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<ExpiredAdResult | null>(null);

  const handleCheck = async () => {
    setChecking(true);
    setResults(null);

    try {
      checkFirebaseTTLFeatures(); // Log TTL info to console
      const expiredResults = await checkExpiredAds();
      setResults(expiredResults as ExpiredAdResult);
    } catch (error) {
      console.error("Error checking expired ads:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setResults({
        hasExpiredAds: false,
        expiredCount: 0,
        error: errorMessage,
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🔍 Firebase Expiration Test</h2>
      <p className="text-gray-600 mb-4">
        This test checks if Firebase automatically handles expired
        advertisements or if we need to implement manual expiration handling.
      </p>

      <button
        onClick={handleCheck}
        disabled={checking}
        className={`px-4 py-2 rounded text-white font-medium ${
          checking
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {checking ? "Checking..." : "🔍 Check Expired Ads"}
      </button>

      {results && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Results:</h3>
          {results.error ? (
            <div className="text-red-600">❌ Error: {results.error}</div>
          ) : (
            <div>
              <div
                className={`mb-2 ${
                  results.hasExpiredAds ? "text-red-600" : "text-green-600"
                }`}
              >
                {results.hasExpiredAds
                  ? `❌ Found ${results.expiredCount} expired ads still in database`
                  : "✅ No expired ads found"}
              </div>

              {results.totalAds !== undefined && (
                <div className="text-sm text-gray-600 space-y-1">
                  <div>📊 Total ads: {results.totalAds}</div>
                  <div>
                    ⏰ Ads with expiry date: {results.adsWithExpiry || 0}
                  </div>
                  <div>
                    🔮 Ads with future expiry: {results.futureExpiryAds || 0}
                  </div>
                </div>
              )}

              {results.expiredAds && results.expiredAds.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Expired Ads:</h4>
                  <div className="text-xs space-y-2 max-h-40 overflow-y-auto">
                    {results.expiredAds.map((ad) => (
                      <div key={ad.id} className="bg-white p-2 rounded border">
                        <div>
                          <strong>Title:</strong> {ad.title}
                        </div>
                        <div>
                          <strong>Type:</strong> {ad.tag}
                        </div>
                        <div>
                          <strong>Expired:</strong>{" "}
                          {ad.expiryDate?.toLocaleString()}
                        </div>
                        <div>
                          <strong>Status:</strong> {ad.status} (
                          {ad.approved ? "Approved" : "Not Approved"})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
            <strong>💡 Check the browser console for detailed logs</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpiredAdsChecker;
