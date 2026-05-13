package com.albanianexecutor;

import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.Toast;

import androidx.annotation.Nullable;

public class FloatingService extends Service {
    private static final String TAG = "FloatingService";
    private WindowManager windowManager;
    private View floatingWindow;
    private WindowManager.LayoutParams windowParams;
    private int initialX;
    private int initialY;
    private float initialTouchX;
    private float initialTouchY;

    @Override
    public void onCreate() {
        super.onCreate();
        createFloatingWindow();
    }

    private void createFloatingWindow() {
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        LayoutInflater inflater = LayoutInflater.from(this);
        floatingWindow = inflater.inflate(R.layout.floating_overlay, null);

        int layoutFlag;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            layoutFlag = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            layoutFlag = WindowManager.LayoutParams.TYPE_PHONE;
        }

        windowParams = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                layoutFlag,
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
                PixelFormat.TRANSLUCENT);

        windowParams.gravity = Gravity.TOP | Gravity.START;
        windowParams.x = 100;
        windowParams.y = 100;

        Button toggleButton = floatingWindow.findViewById(R.id.fab_toggle);
        final FrameLayout panelLayout = floatingWindow.findViewById(R.id.script_panel);
        final EditText scriptEditor = floatingWindow.findViewById(R.id.script_editor);
        Button executeButton = floatingWindow.findViewById(R.id.execute_button);

        toggleButton.setOnClickListener(v -> {
            if (panelLayout.getVisibility() == View.VISIBLE) {
                panelLayout.setVisibility(View.GONE);
            } else {
                panelLayout.setVisibility(View.VISIBLE);
            }
        });

        executeButton.setOnClickListener(v -> {
            String script = scriptEditor.getText().toString();
            executeScript(script);
        });

        toggleButton.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = windowParams.x;
                        initialY = windowParams.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        windowParams.x = initialX + (int) (event.getRawX() - initialTouchX);
                        windowParams.y = initialY + (int) (event.getRawY() - initialTouchY);
                        windowManager.updateViewLayout(floatingWindow, windowParams);
                        return true;
                }
                return false;
            }
        });

        try {
            windowManager.addView(floatingWindow, windowParams);
        } catch (Exception ex) {
            Log.e(TAG, "Unable to add floating window", ex);
            Toast.makeText(this, "Please grant overlay permission", Toast.LENGTH_LONG).show();
        }
    }

    private void executeScript(String script) {
        if (script == null || script.trim().isEmpty()) {
            Toast.makeText(this, "Enter a script before executing.", Toast.LENGTH_SHORT).show();
            return;
        }

        Toast.makeText(this, "Executing script...", Toast.LENGTH_SHORT).show();
        Log.d(TAG, "Executing script: " + script);
        NativeBridge.executeLuaScript(script);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (floatingWindow != null) {
            windowManager.removeView(floatingWindow);
            floatingWindow = null;
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
