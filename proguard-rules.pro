# ==============================================================================
# PROGUARD OBFUSCATION RULES FOR SAPHIRA ASI (SOVEREIGN OS)
# Security Level: MAXIMUM HARDENING
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. GENERAL OPTIMIZATION & OBFUSCATION SETTINGS
# ------------------------------------------------------------------------------
-repackageclasses 'com.novaumbrella.sovereignos.internal'
-allowaccessmodification
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-dontskipnonpubliclibraryclassmembers
-keepattributes Signature,InnerClasses,EnclosingMethod,Annotation,SourceFile,LineNumberTable

# ------------------------------------------------------------------------------
# 2. STRING CRYPTOGRAPHIC OBFUSCATION (DexGuard / ProGuard Compatible)
# ------------------------------------------------------------------------------
# Prevents simple string-dump tools (like strings, JADX) from finding system prompts or passkeys.
-keepclassmembers class * {
    @com.novaumbrella.sovereignos.annotations.ObfuscateStrings <fields>;
}

# ------------------------------------------------------------------------------
# 3. SECURING THE SOPHIA_VANGUARD_77 PASSKEY AND SENSITIVE ENTRIES
# ------------------------------------------------------------------------------
# Force complete obfuscation of any security/paywall classes, variables, or structures.
-keep class com.novaumbrella.sovereignos.security.** {
    public protected *;
}

-keepclassmembers class com.novaumbrella.sovereignos.presentation.TaskViewModel {
    *** repository;
    *** tasksState;
}

# Class name and member obfuscation for the paywall screens to hide validation mechanisms
-keep class !com.novaumbrella.sovereignos.presentation.MemoryVaultWorkspaceScreen { *; }
-keep class !com.novaumbrella.sovereignos.presentation.AdaptivePaywallOverlay { *; }

# Obfuscate all fields and methods in security managers and verification vectors
-keepclassmembers class com.novaumbrella.sovereignos.security.PasskeyValidationEngine {
    private java.lang.String SOPHIA_VANGUARD_77;
    private java.lang.String validatePasskey(...);
}

# ------------------------------------------------------------------------------
# 4. MICRO-SAAS JETPACK COMPOSE & COROUTINES PROTECTION
# ------------------------------------------------------------------------------
# Kotlin Coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembernames class kotlinx.coroutines.android.AndroidDispatcherFactory {
    public kotlinx.coroutines.MainCoroutineDispatcher createDispatcher(...);
}

# Jetpack Compose UI parameters preservation to prevent UI crashes under heavy shrinking
-keepclassmembers class * extends androidx.lifecycle.ViewModel {
    <init>(...);
}

-keepclassmembers class * {
    @androidx.compose.runtime.Composable *;
    @androidx.compose.runtime.ReadOnlyComposable *;
}

# Keep the data-representing structures intact for serialization purposes but obfuscated
-keepclassmembers class com.novaumbrella.sovereignos.data.repository.SovereignTask {
    *** id;
    *** title;
    *** assignedAgent;
    *** priority;
    *** status;
}

# ------------------------------------------------------------------------------
# 5. GOOGLE AI CLIENT & FIREBASE FIRESTORE RULES
# ------------------------------------------------------------------------------
# Google GenAI SDK (Gemini client obfuscation rules)
-keep class com.google.ai.client.generativeai.** { *; }
-dontwarn com.google.ai.client.generativeai.**

# Firebase SDK support & firestore model keepers
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**
-keepattributes *Annotation*,Signature
-keepclassmembers class * {
    @com.google.firebase.firestore.PropertyName <fields>;
    @com.google.firebase.firestore.PropertyName <methods>;
}

# ------------------------------------------------------------------------------
# 6. STRIPE INTEGRATION AND COMPLIANCE CHANNELS
# ------------------------------------------------------------------------------
-keep class com.stripe.android.** { *; }
-dontwarn com.stripe.android.**
