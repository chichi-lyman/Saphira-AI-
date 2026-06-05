package com.saphira.ai.ui

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.ImageDecoder
import android.os.Build
import android.provider.MediaStore
import android.speech.RecognizerIntent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.result.launch
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.saphira.ai.SaphiraViewModel

@Composable
fun SaphiraChatScreen(saphiraViewModel: SaphiraViewModel = viewModel()) {
    val context = LocalContext.current
    val messages by saphiraViewModel.chatMessages.collectAsState()
    var inputText by remember { mutableStateOf("") }
    var selectedBitmap by remember { mutableStateOf<Bitmap?>(null) }

    // Initialize TTS Engine on layout mount
    LaunchedEffect(Unit) {
        saphiraViewModel.initTts(context)
    }

    // Photo Picker Launcher
    val imagePickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri ->
        uri?.let {
            selectedBitmap = if (Build.VERSION.SDK_INT < 28) {
                MediaStore.Images.Media.getBitmap(context.contentResolver, it)
            } else {
                val source = ImageDecoder.createSource(context.contentResolver, it)
                ImageDecoder.decodeBitmap(source).copy(Bitmap.Config.ARGB_8888, true)
            }
        }
    }

    // Speech to Text Launcher
    val speechRecognizerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val spokenText = result.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.get(0)
            if (!spokenText.isNullOrBlank()) {
                inputText = spokenText
            }
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        // Chat History Scroll Window
        LazyColumn(
            modifier = Modifier.weight(1f).fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(messages) { message ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = if (message.second) MaterialTheme.colorScheme.primaryContainer 
                                         else MaterialTheme.colorScheme.secondaryContainer
                    )
                ) {
                    Text(
                        text = if (message.second) "You: ${message.first}" else "Saphira: ${message.first}",
                        modifier = Modifier.padding(12.dp)
                    )
                }
            }
        }

        // Selected Image Preview Thumbnail
        selectedBitmap?.let { bitmap ->
            Row(modifier = Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
                Image(
                    bitmap = bitmap.asImageBitmap(),
                    contentDescription = "Selected Image",
                    modifier = Modifier.size(64.dp).padding(end = 8.dp)
                )
                Button(onClick = { selectedBitmap = null }) {
                    Text("Clear Image")
                }
            }
        }

        // Interaction Action Area
        Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { imagePickerLauncher.launch("image/*") }) {
                Text("\uD83D\uDCF7")
            }
            IconButton(onClick = {
                val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                }
                speechRecognizerLauncher.launch(intent)
            }) {
                Text("\uD83C\uDF99\uFE0F")
            }
            OutlinedTextField(
                value = inputText,
                onValueChange = { inputText = it },
                modifier = Modifier.weight(1f),
                label = { Text("Talk to Saphira...") }
            )
            Spacer(modifier = Modifier.width(4.dp))
            Button(onClick = {
                if (inputText.isNotBlank() || selectedBitmap != null) {
                    saphiraViewModel.sendMessage(inputText, selectedBitmap)
                    inputText = ""
                    selectedBitmap = null
                }
            }) {
                Text("Send")
            }
        }
    }
}
