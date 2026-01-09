
import { useState, useEffect } from 'react';

interface VoiceSearchProps {
  onSearch: (query: string) => void;
  onClose: () => void;
}

export default function VoiceSearch({ onSearch, onClose }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);
      if (final) {
        setTranscript((prev) => prev + final);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const handleStartListening = () => {
    setTranscript('');
    setInterimTranscript('');
    setIsListening(true);
  };

  const handleStopListening = () => {
    setIsListening(false);
  };

  const handleSearch = () => {
    if (transcript.trim()) {
      onSearch(transcript.trim());
    }
  };

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Voice Search</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors whitespace-nowrap"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {!isSupported ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-mic-off-line text-3xl text-red-600"></i>
            </div>
            <p className="text-gray-700 font-medium mb-2">Voice search not supported</p>
            <p className="text-gray-500 text-sm">
              Your browser doesn't support voice recognition. Please try using Chrome or Edge.
            </p>
          </div>
        ) : (
          <>
            {/* Microphone Animation */}
            <div className="flex justify-center mb-6">
              <button
                onClick={isListening ? handleStopListening : handleStartListening}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all whitespace-nowrap ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-teal-500 hover:bg-teal-600'
                }`}
              >
                <i className={`text-4xl text-white ${isListening ? 'ri-stop-circle-line' : 'ri-mic-line'}`}></i>
              </button>
            </div>

            {/* Status */}
            <div className="text-center mb-6">
              <p className="text-gray-700 font-medium mb-2">
                {isListening ? 'Listening...' : 'Tap to speak'}
              </p>
              {isListening && (
                <div className="flex justify-center gap-1">
                  <span className="w-1 h-4 bg-teal-500 rounded-full animate-pulse"></span>
                  <span className="w-1 h-6 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-1 h-8 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1 h-6 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
                  <span className="w-1 h-4 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                </div>
              )}
            </div>

            {/* Transcript */}
            <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] mb-6">
              {transcript || interimTranscript ? (
                <p className="text-gray-900">
                  {transcript}
                  <span className="text-gray-400">{interimTranscript}</span>
                </p>
              ) : (
                <p className="text-gray-400 text-center">
                  Your speech will appear here...
                </p>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={!transcript.trim()}
              className="w-full px-6 py-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
            >
              Search Products
            </button>
          </>
        )}
      </div>
    </div>
  );
}
