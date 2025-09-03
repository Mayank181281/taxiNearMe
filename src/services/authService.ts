import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  User
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserData {
  name: string;
  email: string;
  phone: string;
}

export const registerUser = async (userData: UserData & { password: string }) => {
  try {
    const { password, ...userInfo } = userData;
    
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      password
    );
    
    // Send email verification
    await sendEmailVerification(userCredential.user);
    
    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      ...userInfo,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { success: true, user: userCredential.user };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    return { success: false, error: errorMessage };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      await signOut(auth); // Sign out if email is not verified
      return { 
        success: false, 
        error: 'Please verify your email before logging in. Check your inbox for the verification link.' 
      };
    }
    
    return { success: true, user: userCredential.user };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Logout failed';
    return { success: false, error: errorMessage };
  }
};

export const resendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send verification email';
    return { success: false, error: errorMessage };
  }
};
