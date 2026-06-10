package com.glowplay.app;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.Toast;

import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import com.getcapacitor.CapConfig;

import java.lang.reflect.Field;

public class MainActivity extends BridgeActivity {
    private static final String PREFS_NAME = "glowplay_settings";
    private static final String SERVER_URL_KEY = "server_url";
    private static final String EXTRA_USE_BUNDLED = "use_bundled";

    private boolean hasTriggeredBundledFallback = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        );

        boolean useBundled = shouldUseBundledApp();
        config = configWithServerUrl(useBundled ? null : getCurrentServerUrl());
        super.onCreate(savedInstanceState);
        setupOfflineFallback();
        addSettingsButton();

        if (useBundled) {
            Toast.makeText(this, "حالت آفلاین: نسخه ذخیره‌شده اپ", Toast.LENGTH_SHORT).show();
        }
    }

    private boolean shouldUseBundledApp() {
        return getIntent().getBooleanExtra(EXTRA_USE_BUNDLED, false) || !isNetworkAvailable(this);
    }

    private boolean isNetworkAvailable(Context context) {
        ConnectivityManager connectivityManager =
            (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivityManager == null) {
            return false;
        }

        Network network = connectivityManager.getActiveNetwork();
        if (network == null) {
            return false;
        }

        NetworkCapabilities capabilities = connectivityManager.getNetworkCapabilities(network);
        return capabilities != null && (
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) ||
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)
        );
    }

    private void setupOfflineFallback() {
        if (getBridge() == null || getBridge().getWebView() == null) {
            return;
        }

        WebView webView = getBridge().getWebView();
        WebSettings settings = webView.getSettings();
        settings.setDomStorageEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        getBridge().setWebViewClient(new OfflineFallbackWebViewClient(getBridge()));
    }

    private void addSettingsButton() {
        FrameLayout root = findViewById(android.R.id.content);
        Button settingsButton = new Button(this);
        settingsButton.setText("Settings");
        settingsButton.setAllCaps(false);
        settingsButton.setAlpha(0.9f);
        settingsButton.setOnClickListener(view -> showServerUrlDialog());

        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT,
            Gravity.TOP | Gravity.END
        );
        int margin = dp(16);
        params.setMargins(margin, dp(32), margin, margin);
        root.addView(settingsButton, params);
    }

    private void showServerUrlDialog() {
        EditText input = new EditText(this);
        input.setSingleLine(true);
        input.setText(getCurrentServerUrl());
        input.setSelection(input.getText().length());

        AlertDialog dialog = new AlertDialog.Builder(this)
            .setTitle("Server URL")
            .setMessage("Enter the web app URL this Android app should load.")
            .setView(input)
            .setNegativeButton("Cancel", null)
            .setNeutralButton("Reset", null)
            .setPositiveButton("Save", null)
            .create();

        dialog.setOnShowListener(dialogInterface -> {
            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(view -> {
                String url = input.getText().toString().trim();
                if (!isValidServerUrl(url)) {
                    input.setError("Use a valid http:// or https:// URL");
                    return;
                }

                saveServerUrl(url);
                reloadWithRemoteUrl(url);
                dialog.dismiss();
            });

            dialog.getButton(AlertDialog.BUTTON_NEUTRAL).setOnClickListener(view -> {
                String defaultUrl = BuildConfig.DEFAULT_SERVER_URL;
                input.setText(defaultUrl);
                input.setSelection(input.getText().length());
                saveServerUrl(defaultUrl);
                reloadWithRemoteUrl(defaultUrl);
                dialog.dismiss();
            });
        });

        dialog.show();
    }

    private void reloadWithRemoteUrl(String url) {
        Intent intent = new Intent(this, MainActivity.class);
        intent.putExtra("pending_server_url", url);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        finish();
        startActivity(intent);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }

    private String getCurrentServerUrl() {
        String pendingUrl = getIntent().getStringExtra("pending_server_url");
        if (pendingUrl != null && isValidServerUrl(pendingUrl)) {
            saveServerUrl(pendingUrl);
            getIntent().removeExtra("pending_server_url");
            return pendingUrl;
        }

        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        return prefs.getString(SERVER_URL_KEY, BuildConfig.DEFAULT_SERVER_URL);
    }

    private void saveServerUrl(String url) {
        getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
            .edit()
            .putString(SERVER_URL_KEY, url)
            .apply();
    }

    private boolean isValidServerUrl(String url) {
        Uri uri = Uri.parse(url);
        String scheme = uri.getScheme();
        return uri.getHost() != null && ("http".equals(scheme) || "https".equals(scheme));
    }

    private CapConfig configWithServerUrl(String url) {
        CapConfig loadedConfig = CapConfig.loadDefault(this);
        try {
            Field serverUrlField = CapConfig.class.getDeclaredField("serverUrl");
            serverUrlField.setAccessible(true);
            serverUrlField.set(loadedConfig, url);
        } catch (NoSuchFieldException | IllegalAccessException ignored) {
            // If Capacitor changes internals, the baked config remains the fallback.
        }

        return loadedConfig;
    }

    private void restartInBundledMode() {
        if (hasTriggeredBundledFallback) {
            return;
        }

        hasTriggeredBundledFallback = true;
        Intent intent = new Intent(this, MainActivity.class);
        intent.putExtra(EXTRA_USE_BUNDLED, true);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        finish();
        startActivity(intent);
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private class OfflineFallbackWebViewClient extends BridgeWebViewClient {
        private final Bridge bridge;

        OfflineFallbackWebViewClient(Bridge bridge) {
            super(bridge);
            this.bridge = bridge;
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            if (request.isForMainFrame() && bridge.getServerUrl() != null) {
                restartInBundledMode();
            }
        }

        @Override
        @SuppressWarnings("deprecation")
        public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
            super.onReceivedError(view, errorCode, description, failingUrl);
            if (bridge.getServerUrl() != null) {
                restartInBundledMode();
            }
        }

        @Override
        public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
            super.onReceivedHttpError(view, request, errorResponse);
            if (request.isForMainFrame() && bridge.getServerUrl() != null) {
                restartInBundledMode();
            }
        }
    }
}
