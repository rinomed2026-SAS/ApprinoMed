# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Capacitor WebView - keep JS interface classes
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Capacitor core
-keep class com.getcapacitor.** { *; }
-dontwarn com.getcapacitor.**

# Keep plugin classes
-keep class com.rinomed.app.** { *; }

# AndroidX
-keep class androidx.** { *; }
-dontwarn androidx.**

# Preserve line numbers for crash reporting
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
