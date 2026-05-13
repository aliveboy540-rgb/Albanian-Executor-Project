#include <jni.h>
#include <cstdint>
#include <android/log.h>
#include <string>

static constexpr const char* TAG = "NativeBridge";
static uint64_t g_robloxBaseAddress = 0;

static void logInfo(const char* message) {
    __android_log_print(ANDROID_LOG_INFO, TAG, "%s", message);
}

extern "C" JNIEXPORT void JNICALL
Java_com_albanianexecutor_NativeBridge_initRobloxBaseAddress(JNIEnv* env, jclass clazz, jlong address) {
    g_robloxBaseAddress = static_cast<uint64_t>(address);
    __android_log_print(ANDROID_LOG_INFO, TAG, "Roblox 64-bit base address set: 0x%016llx", (unsigned long long)g_robloxBaseAddress);
}

static bool executeLuauScriptInternal(const char* script) {
    if (g_robloxBaseAddress == 0) {
        __android_log_print(ANDROID_LOG_WARN, TAG, "Attempted to execute script before Roblox base address was initialized.");
        return false;
    }

    // Placeholder for Luau execution.
    // In a real Roblox v8a integration, you would use g_robloxBaseAddress to resolve the correct
    // runtime and interpreter pointers inside Roblox memory, then execute the script in that context.
    __android_log_print(ANDROID_LOG_INFO, TAG, "Executing script against Roblox v8a at base 0x%016llx", (unsigned long long)g_robloxBaseAddress);
    __android_log_print(ANDROID_LOG_INFO, TAG, "Script: %s", script);
    return true;
}

extern "C" JNIEXPORT void JNICALL
Java_com_albanianexecutor_NativeBridge_executeLuaScript(JNIEnv* env, jclass clazz, jstring script) {
    if (script == nullptr) {
        __android_log_print(ANDROID_LOG_WARN, TAG, "executeLuaScript called with null string.");
        return;
    }

    const char* utfScript = env->GetStringUTFChars(script, nullptr);
    if (utfScript == nullptr) {
        __android_log_print(ANDROID_LOG_ERROR, TAG, "Failed to convert Java string.");
        return;
    }

    executeLuauScriptInternal(utfScript);
    env->ReleaseStringUTFChars(script, utfScript);
}
