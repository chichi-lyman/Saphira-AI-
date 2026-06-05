package com.saphira.ai

import android.content.Context
import android.graphics.Bitmap
import android.speech.tts.TextToSpeech
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.vertexai.VertexAI
import com.google.firebase.vertexai.type.content
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.util.Locale

class SaphiraViewModel : ViewModel(), TextToSpeech.OnInitListener {
    private val _chatMessages = MutableStateFlow<List<Pair<String, Boolean>>>(emptyList())
    val chatMessages: StateFlow<List<Pair<String, Boolean>>> = _chatMessages

    private var tts: TextToSpeech? = null
    private var isTtsReady = false

    // Initialize the Gemini API client
    private val vertexAI = VertexAI(apiKey = "YOUR_GEMINI_API_KEY")
    private val saphiraModel = vertexAI.generativeModel(
        modelName = "gemini-1.5-flash",
        systemInstruction = "You are Saphira, a helpful and custom AI assistant."
    )

    // Setup Text-to-Speech Engine
    fun initTts(context: Context) {
        if (tts == null) {
            tts = TextToSpeech(context, this)
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale.US
            isTtsReady = true
        }
    }

    // Process Message (Accepts optional image bitmap)
    fun sendMessage(userPrompt: String, imageBitmap: Bitmap? = null) {
        val displayMessage = if (imageBitmap != null) "$userPrompt 📷 [Image Attached]" else userPrompt
        _chatMessages.value = _chatMessages.value + Pair(displayMessage, true)
        
        viewModelScope.launch {
            try {
                // Multimodal request using Firebase VertexAI Content builder
                val inputContent = content {
                    imageBitmap?.let { image(it) }
                    text(userPrompt)
                }

                val response = saphiraModel.generateContent(inputContent)
                val aiText = response.text ?: "I am having trouble processing that."
                
                _chatMessages.value = _chatMessages.value + Pair(aiText, false)
                speak(aiText) // Speak the AI response out loud
            } catch (e: Exception) {
                _chatMessages.value = _chatMessages.value + Pair("Error: ${e.localizedMessage}", false)
            }
        }
    }

    private fun speak(text: String) {
        if (isTtsReady) {
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, null)
        }
    }

    override fun onCleared() {
        super.onCleared()
        tts?.stop()
        tts?.shutdown()
    }
}
