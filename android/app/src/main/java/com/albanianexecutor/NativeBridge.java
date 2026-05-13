package com.albanianexecutor;

public class NativeBridge {
    static {
        System.loadLibrary("albanian_executor");
    }

    public static native void initRobloxBaseAddress(long baseAddress);
    public static native void executeLuaScript(String script);
}
