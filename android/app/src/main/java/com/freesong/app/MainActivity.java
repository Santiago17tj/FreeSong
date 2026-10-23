package com.freesong.app;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Pantalla de borde a borde: la web recibe los márgenes seguros como variables CSS
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
    }
}
