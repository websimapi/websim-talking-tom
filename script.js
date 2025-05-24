class TalkingTom {
    constructor() {
        this.tom = document.getElementById('tom');
        this.tomImage = document.getElementById('tom-image');
        this.speechBubble = document.getElementById('speech-bubble');
        this.speechText = document.getElementById('speech-text');
        this.eyes = document.getElementById('eyes');
        this.hungerFill = document.getElementById('hunger-fill');
        this.happinessFill = document.getElementById('happiness-fill');
        
        this.hunger = 80;
        this.happiness = 90;
        
        this.isRecording = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        
        this.phrases = [
            "Meow! That's funny!",
            "Hehe, say that again!",
            "I love it when you talk to me!",
            "Purr purr... tell me more!",
            "That tickles my ears!"
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupSpeechRecognition();
        this.startBlinking();
        this.showSpeechBubble("Hi! I'm Tom! Talk to me!");
        this.updateStatusBars();
    }
    
    setupEventListeners() {
        // Control buttons
        document.getElementById('talk-btn').addEventListener('click', () => this.startListening());
        document.getElementById('feed-btn').addEventListener('click', () => this.feed());
        document.getElementById('pet-btn').addEventListener('click', () => this.pet());
        document.getElementById('poke-btn').addEventListener('click', () => this.poke());
        
        // Voice recording buttons
        document.getElementById('start-recording').addEventListener('click', () => this.startRecording());
        document.getElementById('stop-recording').addEventListener('click', () => this.stopRecording());
        
        // Tom interactions
        this.tom.addEventListener('click', () => this.randomInteraction());
    }
    
    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.repeatSpeech(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.log('Speech recognition error:', event.error);
                this.showSpeechBubble("Oops! I couldn't hear you clearly. Try again!");
                this.stopRecording();
            };
            
            this.recognition.onend = () => {
                this.stopRecording();
            };
        } else {
            console.log('Speech recognition not supported');
            document.getElementById('start-recording').textContent = '🚫 Not Supported';
            document.getElementById('start-recording').disabled = true;
        }
    }
    
    startListening() {
        if (this.recognition) {
            this.startRecording();
        } else {
            this.showSpeechBubble("Sorry, speech recognition is not supported in your browser!");
        }
    }
    
    startRecording() {
        if (!this.recognition || this.isRecording) return;
        
        this.isRecording = true;
        this.recognition.start();
        
        document.getElementById('start-recording').disabled = true;
        document.getElementById('stop-recording').disabled = false;
        document.getElementById('recording-status').textContent = '🎤 Listening...';
        
        this.showSpeechBubble("I'm listening... speak now!");
        this.animateTom('bounce');
    }
    
    stopRecording() {
        if (!this.isRecording) return;
        
        this.isRecording = false;
        if (this.recognition) {
            this.recognition.stop();
        }
        
        document.getElementById('start-recording').disabled = false;
        document.getElementById('stop-recording').disabled = true;
        document.getElementById('recording-status').textContent = '';
    }
    
    repeatSpeech(text) {
        this.showSpeechBubble(`You said: "${text}"`);
        
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.pitch = 1.5; // Higher pitch for cute voice
            utterance.rate = 0.9;
            utterance.voice = this.synthesis.getVoices().find(voice => 
                voice.name.includes('Female') || voice.name.includes('female')
            ) || this.synthesis.getVoices()[0];
            
            this.synthesis.speak(utterance);
            this.animateTom('happy');
            
            setTimeout(() => {
                const randomPhrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
                this.showSpeechBubble(randomPhrase);
            }, 1000);
        }, 1000);
        
        this.increaseHappiness(5);
    }
    
    feed() {
        this.hunger = Math.min(100, this.hunger + 20);
        this.happiness = Math.min(100, this.happiness + 10);
        this.updateStatusBars();
        
        this.showSpeechBubble("Yum yum! Thank you for the food! 🍎");
        this.animateTom('bounce');
        
        this.playEatingSound();
    }
    
    pet() {
        this.happiness = Math.min(100, this.happiness + 15);
        this.updateStatusBars();
        
        this.showSpeechBubble("Purr purr... I love being petted! 😊");
        this.animateTom('happy');
        
        this.playPurringSound();
    }
    
    poke() {
        this.showSpeechBubble("Hey! That tickles! Hehe! 😆");
        this.animateTom('shake');
        
        this.playGiggleSound();
        this.increaseHappiness(5);
    }
    
    randomInteraction() {
        const interactions = [
            () => this.showSpeechBubble("Meow! You clicked on me! 😸"),
            () => this.showSpeechBubble("Want to play? Let's have fun! 🎮"),
            () => this.showSpeechBubble("I'm Tom! Nice to meet you! 👋"),
            () => this.showSpeechBubble("Pet me or feed me! I love attention! ❤️")
        ];
        
        const randomAction = interactions[Math.floor(Math.random() * interactions.length)];
        randomAction();
        this.animateTom('bounce');
        this.increaseHappiness(3);
    }
    
    showSpeechBubble(text) {
        this.speechText.textContent = text;
        this.speechBubble.classList.add('show');
        
        setTimeout(() => {
            this.speechBubble.classList.remove('show');
        }, 4000);
    }
    
    animateTom(animationType) {
        this.tom.classList.add(`animate-${animationType}`);
        setTimeout(() => {
            this.tom.classList.remove(`animate-${animationType}`);
        }, 1000);
    }
    
    startBlinking() {
        setInterval(() => {
            this.eyes.classList.add('blinking');
            setTimeout(() => {
                this.eyes.classList.remove('blinking');
            }, 200);
        }, 3000 + Math.random() * 2000);
    }
    
    increaseHappiness(amount) {
        this.happiness = Math.min(100, this.happiness + amount);
        this.updateStatusBars();
    }
    
    updateStatusBars() {
        this.hungerFill.style.width = `${this.hunger}%`;
        this.happinessFill.style.width = `${this.happiness}%`;
        
        // Decrease hunger over time
        setTimeout(() => {
            this.hunger = Math.max(0, this.hunger - 1);
            this.happiness = Math.max(0, this.happiness - 0.5);
            this.updateStatusBars();
        }, 30000); // Every 30 seconds
    }
    
    playEatingSound() {
        // Create a simple eating sound effect
        this.playTone(800, 0.1);
        setTimeout(() => this.playTone(600, 0.1), 100);
        setTimeout(() => this.playTone(800, 0.1), 200);
    }
    
    playPurringSound() {
        // Create a simple purring sound effect
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.playTone(200 + Math.random() * 100, 0.2);
            }, i * 200);
        }
    }
    
    playGiggleSound() {
        // Create a simple giggle sound effect
        this.playTone(800, 0.1);
        setTimeout(() => this.playTone(1000, 0.1), 100);
        setTimeout(() => this.playTone(1200, 0.1), 200);
    }
    
    playTone(frequency, duration) {
        if (!window.AudioContext && !window.webkitAudioContext) return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TalkingTom();
});

