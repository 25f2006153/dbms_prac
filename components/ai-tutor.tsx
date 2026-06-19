"use client";

import { useEffect, useState, useRef } from "react";
import { useCompletion } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, RefreshCw, Sparkles, Volume2, VolumeX } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { LessonTopic } from "@/lib/types";

export function AITutor({ topic, onStartLesson }: { topic: LessonTopic, onStartLesson?: () => void }) {
  const [language, setLanguage] = useState("English");
  const [voiceType, setVoiceType] = useState("Female");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  interface AudioTask {
    type: 'url' | 'speech';
    src?: string;
    text?: string;
    lang?: string;
    gender?: string;
  }

  const spokenTextLength = useRef(0);
  const audioQueue = useRef<AudioTask[]>([]);
  const isPlayingAudio = useRef(false);
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const useFallbackSpeechRef = useRef(false);

  // Stop audio on unmount and initialize Audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      currentAudio.current = new Audio();
      if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
      }
    }
    return () => {
      if (currentAudio.current) {
        currentAudio.current.pause();
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playNextAudio = () => {
    if (audioQueue.current.length === 0) {
      isPlayingAudio.current = false;
      return;
    }
    isPlayingAudio.current = true;
    const task = audioQueue.current.shift();
    if (!task) return;
    
    if (task.type === 'url' && task.src) {
      if (!currentAudio.current) {
        playNextAudio();
        return;
      }
      currentAudio.current.src = task.src;
      currentAudio.current.onended = playNextAudio;
      currentAudio.current.play().catch(e => {
        console.error("Audio play error", e);
        playNextAudio();
      });
    } else if (task.type === 'speech' && task.text) {
      const utterance = new SpeechSynthesisUtterance(task.text);
      
      let langCode = 'en-US';
      const taskLang = task.lang || 'English';
      if (taskLang === 'Hindi' || taskLang === 'Hinglish') langCode = 'hi-IN';
      else if (taskLang === 'Bengali') langCode = 'bn-IN';
      else if (taskLang === 'Spanish') langCode = 'es-ES';
      else if (taskLang === 'French') langCode = 'fr-FR';
      utterance.lang = langCode;

      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        const matchingVoices = voices.filter(v => 
          v.lang.toLowerCase().replace('_', '-').startsWith(langCode.substring(0, 2).toLowerCase())
        );
        if (matchingVoices.length > 0) {
          const targetGender = task.gender || 'Female';
          const selectedVoice = matchingVoices.find(v => {
            const name = v.name.toLowerCase();
            if (targetGender === 'Male') {
              return name.includes('male') || name.includes('david') || name.includes('google') || name.includes('microsoft') || name.includes('ravi');
            } else {
              return name.includes('female') || name.includes('zira') || name.includes('google') || name.includes('microsoft') || name.includes('swara') || name.includes('sangeeta');
            }
          }) || matchingVoices[0];
          utterance.voice = selectedVoice;
        }
      }

      utterance.onend = () => {
        playNextAudio();
      };
      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error", e);
        playNextAudio();
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      playNextAudio();
    }
  };

  const getVoiceId = (lang: string, gender: string) => {
    // Fallback standard high-quality voices (ElevenLabs multilingual model adapts perfectly to Hindi/Spanish/French natively)
    if (gender === "Male") {
      return "ErXwobaYiN019PkySvjV"; // Antoni
    } else {
      return "EXAVITQu4vr4xnSDxMaL"; // Bella
    }
  };

  const queueTextForSpeech = async (text: string, lang: string, gender: string) => {
    if (!isAudioEnabled) return;

    if (useFallbackSpeechRef.current) {
      audioQueue.current.push({ type: 'speech', text, lang, gender });
      if (!isPlayingAudio.current) {
        playNextAudio();
      }
      return;
    }

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: getVoiceId(lang, gender) })
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        audioQueue.current.push({ type: 'url', src: url });
        if (!isPlayingAudio.current) {
          playNextAudio();
        }
      } else {
        console.warn("ElevenLabs TTS failed or quota exceeded. Falling back to browser Web Speech API.");
        useFallbackSpeechRef.current = true;
        audioQueue.current.push({ type: 'speech', text, lang, gender });
        if (!isPlayingAudio.current) {
          playNextAudio();
        }
      }
    } catch (err) {
      console.error("Failed to fetch TTS, falling back to Web Speech API", err);
      useFallbackSpeechRef.current = true;
      audioQueue.current.push({ type: 'speech', text, lang, gender });
      if (!isPlayingAudio.current) {
        playNextAudio();
      }
    }
  };

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/tutor",
    streamProtocol: "text",
    body: {
      topicDetails: {
        title: topic.title,
        overview: topic.overview,
        query: topic.query,
      },
      language,
    },
  });

  // Stream text-to-speech chunk by chunk using ElevenLabs
  useEffect(() => {
    if (!completion || !isAudioEnabled) return;
    
    let fullTextForTTS = completion;
    if (language === 'Hinglish') {
      // Extract only the closed <speech> tags for pristine Hindi audio
      const speechMatches = [...completion.matchAll(/<speech>([\s\S]*?)<\/speech>/g)];
      fullTextForTTS = speechMatches.map(m => m[1]).join(" ");
    }

    // Split into complete sentences, including Hindi Purna Viram (।)
    const sentences = fullTextForTTS.match(/[^.!?\n।]+[.!?\n।]+/g) || [];
    const completeTextToSpeak = sentences.join("");
    
    if (completeTextToSpeak.length > spokenTextLength.current) {
      const newText = completeTextToSpeak.substring(spokenTextLength.current).trim();
      const cleanText = newText.replace(/[*_#`]/g, ""); // Strip markdown
      
      if (cleanText) {
        // Send pure Hindi to ElevenLabs if Hinglish is selected (since it reads Devanagari natively)
        queueTextForSpeech(cleanText, language === 'Hinglish' ? 'Hindi' : language, voiceType);
        spokenTextLength.current = completeTextToSpeak.length;
      }
    }
  }, [completion, language, voiceType, isAudioEnabled]);

  const handleStartTutor = () => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      // Unlock audio context on Safari/Chrome with a silent sound
      currentAudio.current.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
      currentAudio.current.play().catch(() => {});
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    audioQueue.current = [];
    isPlayingAudio.current = false;
    spokenTextLength.current = 0;
    
    if (onStartLesson) {
      onStartLesson();
    }
    complete("Please teach me this topic");
  };



  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (isAudioEnabled) {
      if (currentAudio.current) {
        currentAudio.current.pause();
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      audioQueue.current = [];
      isPlayingAudio.current = false;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const languages = ["English", "Hinglish", "Hindi", "Bengali", "Spanish", "French"];

  // Process completion for display: hide <speech> tags and strip <text> wrappers
  let displayCompletion = completion || "";
  if (language === 'Hinglish' && displayCompletion) {
    displayCompletion = displayCompletion.replace(/<speech>[\s\S]*?(<\/speech>|$)/g, "").replace(/<\/?text>/g, "");
  }

  return (
    <Card className={`flex flex-col overflow-hidden bg-slate-900 border-white/10 shadow-2xl relative transition-all duration-300 ${
      isFullscreen 
        ? "fixed inset-0 z-50 rounded-none w-screen h-screen" 
        : "min-h-[500px]"
    }`}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-md p-4 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white tracking-tight flex items-center gap-2">
              Gemini AI Tutor <Sparkles className="w-4 h-4 text-purple-400" />
            </h3>
            <p className="text-xs text-slate-400 font-mono">NotebookLM-style Audio Instructor</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            )}
          </button>
          
          <button
            onClick={toggleAudio}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors"
            title={isAudioEnabled ? "Mute Audio" : "Enable Audio"}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
          
          <select
            value={voiceType}
            onChange={(e) => setVoiceType(e.target.value)}
            disabled={isLoading}
            className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            <option value="Female">Female Voice</option>
            <option value="Male">Male Voice</option>
          </select>
          
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isLoading}
            className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <button
            onClick={handleStartTutor}
            disabled={isLoading}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 transition-colors text-white px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(147,51,234,0.4)]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : completion ? (
              "Regenerate Lesson"
            ) : (
              "Start Lesson"
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto relative z-10 prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-950/80 prose-pre:border prose-pre:border-white/10 prose-headings:text-purple-300 max-w-none">
        {!completion && !isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
            <Bot className="w-16 h-16 text-slate-600" />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-slate-300">Ready to learn {topic.title}?</p>
              <p className="text-sm text-slate-500 max-w-sm">
                Click "Start Lesson" to begin the synchronized audio-visual experience powered by Gemini.
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayCompletion}</ReactMarkdown>
            {isLoading && (
              <span className="inline-block w-2 h-4 ml-1 bg-purple-500 animate-pulse" />
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
