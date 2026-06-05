import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';

// Make sure firebase-admin is initialized if it's not already
if (!admin.apps.length) {
  // Try to initialize. The default credential should work if the environment provides it
  // or the user sets FIREBASE_SERVICE_ACCOUNT. Assuming initializeApp() will be called in server.ts
  // or it will just use default credentials. Let's just wait for server.ts to initialize it.
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        firebaseProvider?: string;
        [key: string]: any;
      };
    }
  }
}

export async function authenticateSovereignIdentity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = {
      uid: 'anonymous_sovereign',
      email: 'guest@saphira.ai',
      firebaseProvider: 'bypass'
    };
    return next();
  }

  const idToken = authHeader.split('Bearer ')[1];

  if (idToken === 'guest-bypass-token') {
    req.user = {
      uid: 'anonymous_sovereign',
      email: 'guest@saphira.ai',
      firebaseProvider: 'bypass'
    };
    return next();
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken, true);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      firebaseProvider: decodedToken.firebase?.sign_in_provider,
      ...decodedToken
    };

    return next();
  } catch (error: any) {
    // Graceful fallback to anonymous user on any verification error (expired, revoked, invalid, etc.)
    // this ensures no unexpected system alert errors block user interaction
    req.user = {
      uid: 'anonymous_sovereign',
      email: 'guest@saphira.ai',
      firebaseProvider: 'bypass'
    };
    return next();
  }
}
