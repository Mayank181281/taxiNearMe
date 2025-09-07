import { collection, addDoc, getDocs, query, limit } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Create sample users for testing the admin panel
 * This function should only be used for development/testing purposes
 */
export const createSampleUsers = async (): Promise<void> => {
  try {
    // Check if users already exist
    const usersQuery = query(collection(db, "users"), limit(1));
    const existingUsers = await getDocs(usersQuery);

    if (existingUsers.docs.length > 0) {
      console.log("Users already exist, skipping sample user creation");
      return;
    }

    const sampleUsers = [
      {
        name: "John Smith",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        phone: "+1234567890",
        city: "New York",
        state: "New York",
        status: "active",
        subscriptionPlan: "Free",
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-08-30"),
      },
      {
        name: "Maria Garcia",
        firstName: "Maria",
        lastName: "Garcia",
        email: "maria.garcia@example.com",
        phone: "+1234567891",
        city: "Los Angeles",
        state: "California",
        status: "active",
        subscriptionPlan: "VIP",
        createdAt: new Date("2025-02-20"),
        updatedAt: new Date("2025-08-29"),
      },
      {
        name: "David Wilson",
        firstName: "David",
        lastName: "Wilson",
        email: "david.wilson@example.com",
        phone: "+1234567892",
        city: "Chicago",
        state: "Illinois",
        status: "active",
        subscriptionPlan: "Free",
        createdAt: new Date("2025-03-10"),
        updatedAt: new Date("2025-08-28"),
      },
      {
        name: "Sarah Johnson",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@example.com",
        phone: "+1234567893",
        city: "Houston",
        state: "Texas",
        status: "active",
        subscriptionPlan: "VIP Prime",
        createdAt: new Date("2025-01-28"),
        updatedAt: new Date("2025-08-30"),
      },
      {
        name: "Ahmed Hassan",
        firstName: "Ahmed",
        lastName: "Hassan",
        email: "ahmed.hassan@example.com",
        phone: "+1234567894",
        city: "Phoenix",
        state: "Arizona",
        status: "inactive",
        subscriptionPlan: "Free",
        createdAt: new Date("2025-04-05"),
        updatedAt: new Date("2025-08-27"),
      },
      {
        name: "Emily Chen",
        firstName: "Emily",
        lastName: "Chen",
        email: "emily.chen@example.com",
        phone: "+1234567895",
        city: "Philadelphia",
        state: "Pennsylvania",
        status: "active",
        subscriptionPlan: "Free",
        createdAt: new Date("2025-05-12"),
        updatedAt: new Date("2025-08-29"),
      },
      {
        name: "Michael Brown",
        firstName: "Michael",
        lastName: "Brown",
        email: "michael.brown@example.com",
        phone: "+1234567896",
        city: "San Antonio",
        state: "Texas",
        status: "active",
        subscriptionPlan: "VIP",
        createdAt: new Date("2025-03-18"),
        updatedAt: new Date("2025-08-26"),
      },
      {
        name: "Lisa Taylor",
        firstName: "Lisa",
        lastName: "Taylor",
        email: "lisa.taylor@example.com",
        phone: "+1234567897",
        city: "San Diego",
        state: "California",
        status: "suspended",
        subscriptionPlan: "Free",
        createdAt: new Date("2025-06-08"),
        updatedAt: new Date("2025-08-30"),
      },
    ];

    console.log("Creating sample users...");

    for (const user of sampleUsers) {
      await addDoc(collection(db, "users"), user);
    }

    console.log("Sample users created successfully!");
  } catch (error) {
    console.error("Error creating sample users:", error);
    throw error;
  }
};

/**
 * Initialize sample data for admin panel
 * Call this function once to populate the database with test data
 */
export const initializeAdminData = async (): Promise<void> => {
  try {
    console.log("Initializing admin data...");
    await createSampleUsers();
    console.log("Admin data initialization complete!");
  } catch (error) {
    console.error("Error initializing admin data:", error);
    throw error;
  }
};
