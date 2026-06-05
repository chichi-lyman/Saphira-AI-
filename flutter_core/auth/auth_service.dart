import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  // Securely store additional generic credentials/tokens
  Future<void> _persistSecureToken(User? user) async {
    if (user != null) {
      final idToken = await user.getIdToken();
      await _secureStorage.write(key: 'saphira_neural_token', value: idToken);
      await _secureStorage.write(key: 'saphira_user_uid', value: user.uid);
    }
  }

  Future<void> _clearSecureToken() async {
    await _secureStorage.delete(key: 'saphira_neural_token');
    await _secureStorage.delete(key: 'saphira_user_uid');
  }

  // Email/Password Registration
  Future<UserCredential?> registerWithEmail(String email, String password) async {
    try {
      final credential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      await _persistSecureToken(credential.user);
      return credential;
    } catch (e) {
      print("Error registering with email: $e");
      rethrow;
    }
  }

  // Email/Password Login
  Future<UserCredential?> loginWithEmail(String email, String password) async {
    try {
      final credential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      await _persistSecureToken(credential.user);
      return credential;
    } catch (e) {
      print("Error logging in with email: $e");
      rethrow;
    }
  }

  // Google Sign-In
  Future<UserCredential?> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return null; // Cancelled by user

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final AuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final userCredential = await _auth.signInWithCredential(credential);
      await _persistSecureToken(userCredential.user);
      return userCredential;
    } catch (e) {
      print("Error signing in with Google: $e");
      rethrow;
    }
  }

  // Apple Sign-In
  Future<UserCredential?> signInWithApple() async {
    try {
      final AuthorizationCredentialAppleID appleCredential = 
          await SignInWithApple.getAppleIDCredential(
        scopes: [
          AppleIDAuthorizationScopes.email,
          AppleIDAuthorizationScopes.fullName,
        ],
      );

      final OAuthProvider oAuthProvider = OAuthProvider('apple.com');
      final AuthCredential credential = oAuthProvider.credential(
        idToken: appleCredential.identityToken,
        accessToken: appleCredential.authorizationCode,
      );

      final userCredential = await _auth.signInWithCredential(credential);
      await _persistSecureToken(userCredential.user);
      return userCredential;
    } catch (e) {
      print("Error signing in with Apple: $e");
      rethrow;
    }
  }

  // Logout
  Future<void> logout() async {
    await _clearSecureToken();
    await _googleSignIn.signOut();
    await _auth.signOut();
  }

  // Current User Stream
  Stream<User?> get user => _auth.authStateChanges();
}
