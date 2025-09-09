import React, { useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/firebase";

interface DatabaseAd {
  id: string;
  title: string;
  tag: string;
  status: string;
  approved: boolean;
  expiryDate?: Date;
  originalTag?: string;
  downgradedAt?: Date;
  autoDowngraded?: boolean;
}

const DatabaseDiagnostic: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<{
    allAds: DatabaseAd[];
    expiredVipAds: DatabaseAd[];
    freeAds: DatabaseAd[];
    downgradedAds: DatabaseAd[];
  } | null>(null);

  const runDiagnostic = async () => {
    setLoading(true);
    setDiagnosticData(null);

    try {
      console.log("🔍 Running database diagnostic...");

      // Get all ads from database
      const allAdsQuery = query(collection(db, "adData"));
      const allAdsSnapshot = await getDocs(allAdsQuery);

      const allAds: DatabaseAd[] = [];
      const expiredVipAds: DatabaseAd[] = [];
      const freeAds: DatabaseAd[] = [];
      const downgradedAds: DatabaseAd[] = [];

      const now = new Date();

      allAdsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const ad: DatabaseAd = {
          id: doc.id,
          title: data.title || "Untitled",
          tag: data.tag || "unknown",
          status: data.status || "unknown",
          approved: data.approved || false,
          expiryDate: data.expiryDate?.toDate?.(),
          originalTag: data.originalTag,
          downgradedAt: data.downgradedAt?.toDate?.(),
          autoDowngraded: data.autoDowngraded || false,
        };

        allAds.push(ad);

        // Check if it's expired VIP/VIP Prime
        if (
          ad.expiryDate &&
          ad.expiryDate < now &&
          (ad.tag === "vip" || ad.tag === "vip-prime")
        ) {
          expiredVipAds.push(ad);
        }

        // Check if it's free
        if (ad.tag === "free") {
          freeAds.push(ad);
        }

        // Check if it was downgraded
        if (ad.originalTag || ad.downgradedAt) {
          downgradedAds.push(ad);
        }
      });

      console.log("📊 Diagnostic Results:", {
        totalAds: allAds.length,
        expiredVipAds: expiredVipAds.length,
        freeAds: freeAds.length,
        downgradedAds: downgradedAds.length,
      });

      setDiagnosticData({
        allAds,
        expiredVipAds,
        freeAds,
        downgradedAds,
      });
    } catch (error) {
      console.error("❌ Diagnostic error:", error);
      alert("Error running diagnostic. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold mb-3">🔍 Database Diagnostic</h3>
      <p className="text-gray-600 mb-4">
        This will show you exactly what's in the database and why no expired ads
        were found.
      </p>

      <button
        onClick={runDiagnostic}
        disabled={loading}
        className={`px-6 py-2 rounded text-white font-medium ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Analyzing..." : "🔍 Run Diagnostic"}
      </button>

      {diagnosticData && (
        <div className="mt-6 space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded text-center">
              <div className="text-2xl font-bold text-blue-600">
                {diagnosticData.allAds.length}
              </div>
              <div className="text-sm text-blue-800">Total Ads</div>
            </div>
            <div className="bg-red-50 p-3 rounded text-center">
              <div className="text-2xl font-bold text-red-600">
                {diagnosticData.expiredVipAds.length}
              </div>
              <div className="text-sm text-red-800">Expired VIP/Prime</div>
            </div>
            <div className="bg-green-50 p-3 rounded text-center">
              <div className="text-2xl font-bold text-green-600">
                {diagnosticData.freeAds.length}
              </div>
              <div className="text-sm text-green-800">Free Ads</div>
            </div>
            <div className="bg-orange-50 p-3 rounded text-center">
              <div className="text-2xl font-bold text-orange-600">
                {diagnosticData.downgradedAds.length}
              </div>
              <div className="text-sm text-orange-800">Downgraded</div>
            </div>
          </div>

          {/* Detailed breakdown */}
          <div className="space-y-4">
            {/* All Ads */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                📋 All Ads in Database ({diagnosticData.allAds.length})
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {diagnosticData.allAds.map((ad) => (
                  <div key={ad.id} className="text-sm bg-gray-50 p-2 rounded">
                    <div>
                      <strong>Title:</strong> {ad.title}
                    </div>
                    <div>
                      <strong>Tag:</strong> {ad.tag}
                    </div>
                    <div>
                      <strong>Status:</strong> {ad.status}
                    </div>
                    <div>
                      <strong>Expiry:</strong>{" "}
                      {ad.expiryDate?.toLocaleString() || "No expiry"}
                    </div>
                    {ad.originalTag && (
                      <div>
                        <strong>Original Tag:</strong> {ad.originalTag}
                      </div>
                    )}
                    {ad.downgradedAt && (
                      <div>
                        <strong>Downgraded:</strong>{" "}
                        {ad.downgradedAt.toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Expired VIP Ads */}
            {diagnosticData.expiredVipAds.length > 0 && (
              <div className="border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-700 mb-2">
                  ⚠️ Still Expired VIP/Prime Ads (
                  {diagnosticData.expiredVipAds.length})
                </h4>
                <div className="space-y-2">
                  {diagnosticData.expiredVipAds.map((ad) => (
                    <div key={ad.id} className="text-sm bg-red-50 p-2 rounded">
                      <div>
                        <strong>Title:</strong> {ad.title}
                      </div>
                      <div>
                        <strong>Tag:</strong> {ad.tag}
                      </div>
                      <div>
                        <strong>Expired:</strong>{" "}
                        {ad.expiryDate?.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recently Downgraded */}
            {diagnosticData.downgradedAds.length > 0 && (
              <div className="border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-700 mb-2">
                  ✅ Already Downgraded Ads (
                  {diagnosticData.downgradedAds.length})
                </h4>
                <div className="space-y-2">
                  {diagnosticData.downgradedAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="text-sm bg-green-50 p-2 rounded"
                    >
                      <div>
                        <strong>Title:</strong> {ad.title}
                      </div>
                      <div>
                        <strong>Current Tag:</strong> {ad.tag}
                      </div>
                      {ad.originalTag && (
                        <div>
                          <strong>Was:</strong> {ad.originalTag}
                        </div>
                      )}
                      {ad.downgradedAt && (
                        <div>
                          <strong>Downgraded:</strong>{" "}
                          {ad.downgradedAt.toLocaleString()}
                        </div>
                      )}
                      {ad.autoDowngraded && (
                        <div>
                          <strong>Auto-processed:</strong> Yes
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg text-sm">
            <strong>💡 Analysis:</strong>
            {diagnosticData.expiredVipAds.length === 0 &&
              diagnosticData.downgradedAds.length > 0 && (
                <span className="text-green-700">
                  {" "}
                  ✅ Great! The expired ads have already been processed and
                  converted to Free ads.
                </span>
              )}
            {diagnosticData.expiredVipAds.length > 0 && (
              <span className="text-red-700">
                {" "}
                ⚠️ There are still {diagnosticData.expiredVipAds.length} expired
                ads that need processing.
              </span>
            )}
            {diagnosticData.expiredVipAds.length === 0 &&
              diagnosticData.downgradedAds.length === 0 && (
                <span className="text-blue-700">
                  {" "}
                  ℹ️ No expired ads found and no downgraded ads. Either no ads
                  have expired yet or they've been processed.
                </span>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseDiagnostic;
