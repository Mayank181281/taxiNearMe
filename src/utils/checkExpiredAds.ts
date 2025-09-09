import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Check for expired advertisements in the database
 * This function helps determine if Firebase automatically handles expired ads
 */
export const checkExpiredAds = async () => {
  try {
    console.log("🔍 Checking for expired advertisements...");

    const now = new Date();
    const nowTimestamp = Timestamp.fromDate(now);

    // Query for ads that should be expired (expiryDate < current time)
    const expiredAdsQuery = query(
      collection(db, "adData"),
      where("expiryDate", "<", nowTimestamp)
    );

    const expiredSnapshot = await getDocs(expiredAdsQuery);

    console.log(`📊 Total expired ads found: ${expiredSnapshot.docs.length}`);

    if (expiredSnapshot.docs.length > 0) {
      console.log("🚨 EXPIRED ADS STILL EXIST IN DATABASE:");
      expiredSnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`  ${index + 1}. ID: ${doc.id}`);
        console.log(`     Title: ${data.title}`);
        console.log(`     Tag: ${data.tag}`);
        console.log(
          `     Expired: ${data.expiryDate?.toDate?.()?.toLocaleString()}`
        );
        console.log(`     Status: ${data.status}`);
        console.log(`     Approved: ${data.approved}`);
        console.log(`     ---`);
      });

      console.log(
        "❌ Firebase does NOT automatically delete expired documents"
      );
      return {
        hasExpiredAds: true,
        expiredCount: expiredSnapshot.docs.length,
        expiredAds: expiredSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          expiryDate: doc.data().expiryDate?.toDate?.(),
        })),
      };
    } else {
      console.log("✅ No expired ads found - either:");
      console.log("  1. Firebase automatically removes them, OR");
      console.log("  2. No ads have expired yet, OR");
      console.log("  3. No ads have expiryDate set");

      // Let's also check total ads with expiryDate
      const allAdsQuery = query(collection(db, "adData"));
      const allAdsSnapshot = await getDocs(allAdsQuery);

      let adsWithExpiry = 0;
      let futureExpiryAds = 0;

      allAdsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.expiryDate) {
          adsWithExpiry++;
          if (data.expiryDate.toDate() > now) {
            futureExpiryAds++;
          }
        }
      });

      console.log(`📈 Total ads: ${allAdsSnapshot.docs.length}`);
      console.log(`⏰ Ads with expiry date: ${adsWithExpiry}`);
      console.log(`🔮 Ads with future expiry: ${futureExpiryAds}`);

      return {
        hasExpiredAds: false,
        expiredCount: 0,
        totalAds: allAdsSnapshot.docs.length,
        adsWithExpiry,
        futureExpiryAds,
      };
    }
  } catch (error) {
    console.error("❌ Error checking expired ads:", error);
    throw error;
  }
};

/**
 * Check if Firebase has any TTL (Time To Live) configuration
 */
export const checkFirebaseTTLFeatures = () => {
  console.log("🔍 Checking Firebase TTL capabilities...");
  console.log("📋 Firebase/Firestore TTL Information:");
  console.log("  ❌ Firestore does NOT have automatic document TTL/expiration");
  console.log(
    "  ❌ Unlike MongoDB, Firestore doesn't auto-delete expired docs"
  );
  console.log("  ✅ You need to implement expiration handling manually via:");
  console.log("    1. Client-side filtering");
  console.log("    2. Cloud Functions with scheduled triggers");
  console.log("    3. Manual admin cleanup processes");
  console.log("");
  console.log("💡 Recommendation: Implement client-side expiration filtering");
};
