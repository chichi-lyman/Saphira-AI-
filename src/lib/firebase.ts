import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocFromServer, 
  Timestamp 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, AppCheck } from "firebase/app-check";
import { getRemoteConfig, fetchAndActivate, getString, RemoteConfig } from "firebase/remote-config";
import { getAI, getGenerativeModel, VertexAIBackend, AI } from "firebase/ai";
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/chat');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuthCache = (onAuthChange: (user: FirebaseUser | null, token: string | null) => void) => {
  return onAuthStateChanged(auth, (user: FirebaseUser | null) => {
    if (!user) {
      cachedAccessToken = null;
    }
    onAuthChange(user, cachedAccessToken);
  });
};

export const googleSignInWithToken = async (): Promise<{ user: FirebaseUser; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }
    return { user: result.user, accessToken: cachedAccessToken || '' };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};


export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  const errString = JSON.stringify(errInfo);
  console.error('Firestore Error: ', errString);
  throw new Error(errString);
}

// Storage helpers
export const uploadFile = async (file: File | Blob, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const uploadBase64 = async (base64: string, path: string, mimeType: string): Promise<string> => {
  const response = await fetch(base64);
  const blob = await response.blob();
  return uploadFile(blob, path);
};

// 2. Client-Side Firebase App Check, Remote Config, and Vertex AI Integration
export let appCheck: AppCheck | null = null;
export let remoteConfig: RemoteConfig | null = null;
export let vertexAI: AI | null = null;

if (typeof window !== 'undefined') {
  try {
    // 3. Initialize Firebase App Check
    // Protects your Gemini API quota by ensuring only your authentic app can make requests
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider('6LcA_YourActualReCaptchaEnterpriseSiteKeyHere'),
      isTokenAutoRefreshEnabled: true // Automatically refreshes attestation tokens in the background
    });

    // 4. Initialize Remote Config
    remoteConfig = getRemoteConfig(app);

    // Configure development settings (reduce fetch cache duration for testing)
    remoteConfig.settings = {
      minimumFetchIntervalMillis: 0,
      fetchTimeoutMillis: 10000,
    };

    // Define client-side fallback defaults for your agent parameters
    remoteConfig.defaultConfig = {
      system_instruction: "You are Saphira, an advanced sovereign intelligence assistant specializing in logical synthesis.",
      model_temperature: "0.7"
    };

    // 5. Initialize Firebase Vertex AI (AI Logic Layer)
    // This SDK routes your requests through secure Firebase infrastructure natively
    vertexAI = getAI(app, {
      backend: new VertexAIBackend()
    });
  } catch (err) {
    console.warn("Client-side Firebase services initialization (App Check/Remote Config/Vertex AI) standby:", err);
  }
}

/**
 * Orchestration function to fetch dynamic configurations and invoke the model
 * @param userPrompt The string containing the user's input request
 */
export async function generateSaphiraResponse(userPrompt: string) {
  try {
    if (!remoteConfig || !vertexAI) {
      throw new Error("Saphira Vertex AI / Remote Config services are not initialized in this environment.");
    }

    // Synchronize latest system prompts and settings from the Firebase Console
    await fetchAndActivate(remoteConfig);
    
    // Retrieve runtime values managed over-the-air
    const activeSystemInstruction = getString(remoteConfig, "system_instruction") || "You are Saphira, an advanced sovereign intelligence assistant specializing in logical synthesis.";
    const activeTemperature = parseFloat(getString(remoteConfig, "model_temperature") || "0.7");

    // Initialize the target generative model instance securely
    const model = getGenerativeModel(vertexAI, {
      model: "gemini-2.5-flash", // Or your preferred active model target
      generationConfig: {
        temperature: activeTemperature,
        topP: 0.95,
      },
      systemInstruction: activeSystemInstruction
    });

    // Execute the request
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
    });
    const responseText = result.response.text;
    
    return responseText || '';
  } catch (error) {
    console.error("Error executing Saphira AI Logic pipeline:", error);
    throw error;
  }
}

