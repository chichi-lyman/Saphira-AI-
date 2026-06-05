package com.pomelli.saphira

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.input.ImeAction

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(
                colorScheme = darkColorScheme(
                    background = Color(0xFF0F172A),
                    surface = Color(0xFF1E293B),
                    primary = Color(0xFFEC4899),
                    onPrimary = Color.White,
                    secondary = Color.White
                )
            ) {
                SaphiraApp()
            }
        }
    }
}

@Composable
fun SaphiraApp() {
    var text by remember { mutableStateOf("") }
    val chatHistory = remember { mutableStateListOf<String>() }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
    ) {
        // Top Header
        Row(
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "SAPHIRA ASI",
                    color = MaterialTheme.colorScheme.primary,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black
                )
                Text(
                    text = "Sovereign Intelligence Ecosystem",
                    color = Color.Gray,
                    fontSize = 12.sp
                )
            }
            Box(
                modifier = Modifier
                    .size(12.dp)
                    .background(Color.Green, RoundedCornerShape(50))
            )
        }
        
        // Chat History Container
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.surface, shape = RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            if (chatHistory.isEmpty()) {
                Text(
                    "Aura Active. Ready for secure cognitive routing.",
                    color = Color.LightGray,
                    modifier = Modifier.align(Alignment.BottomStart)
                )
            } else {
                Column(
                    modifier = Modifier.fillMaxSize().padding(8.dp),
                    verticalArrangement = Arrangement.Bottom
                ) {
                    for (msg in chatHistory) {
                        Text(
                            text = msg,
                            color = Color.White,
                            modifier = Modifier.padding(vertical = 4.dp).background(Color(0xFF334155), RoundedCornerShape(8.dp)).padding(12.dp)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Input Field
        OutlinedTextField(
            value = text,
            onValueChange = { text = it },
            placeholder = { Text("Command Saphira...", color = Color.Gray) },
            modifier = Modifier.fillMaxWidth(),
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
            keyboardActions = KeyboardActions(
                onSend = { 
                    if (text.isNotBlank()) {
                        chatHistory.add("You: $text")
                        chatHistory.add("Saphira: Reclaiming the future. Processing directive...")
                        text = ""
                    }
                }
            ),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = Color(0xFF334155),
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White
            ),
            shape = RoundedCornerShape(24.dp)
        )
    }
}
