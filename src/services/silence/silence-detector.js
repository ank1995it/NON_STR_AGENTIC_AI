// src/services/silence/silence-detector.js
import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';

export class SilenceDetector extends EventEmitter {
  constructor(speechManager, config) {
    super();
    this.speechManager = speechManager;
    this.config = config;
    this.silenceTimer = null;
    this.disconnectTimer = null;
    this.lastActivityTime = null;
    this.warningLevel = 0;
    this.isInitialized = false;
    this.warnings = [    
      { time: 20000, message: "initiation from LLM" },
     // { time: 10000, message: "Hello, are you still on the line?" },
     // { time: 10000, message: "Please respond if you can hear me." },
     // { time: 10000, message: "As we haven't received any response, we'll be disconnecting this call. Thank you." }
    ];
    this.disconnectDelay = 30000; // 10 seconds after final warning
    logger.info('Silence detector initialized');
  }

  initializeDetector() {
    this.isInitialized = true;
    this.lastActivityTime = Date.now();
    this.warningLevel = 0;
    this.emit('welcomeMsg' , "##########" )
    //this.emit('welcomeMsg' , "{\"assistant\":\"Hi, I am Alex, Your AI Account Representative from ABC Bank. Am i speaking with Peter Smith?\",\"emotion\":\"friendly\"}" )
    this.startSilenceCheck();
    logger.info('Silence detection started');
  }

  handleActivity() {
    if(!this.isInitialized) return;
    
    this.lastActivityTime = Date.now();
    this.warningLevel = 0;
    this.startSilenceCheck();
    logger.debug('Activity detected, silence timer reset');
  }

  startSilenceCheck() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }
    if (this.disconnectTimer) {
      clearTimeout(this.disconnectTimer);
    }

    if (this.warningLevel >= this.warnings.length) return;

    const nextWarning = this.warnings[this.warningLevel];
    const timeUntilWarning = nextWarning.time;

    this.silenceTimer = setTimeout(() => {
      if (this.speechManager.isSpeaking()) {
        logger.debug('TTS speaking, skipping silence check');
        return;
      }

      logger.info({
        warningLevel: this.warningLevel,
        message: nextWarning.message
      }, 'Emitting silence warning');

      this.emit('silenceWarning', nextWarning.message);
      this.warningLevel++;

      if (this.warningLevel < this.warnings.length) {
        this.startSilenceCheck();
      } else {
        // Set disconnect timer after final warning
        this.disconnectTimer = setTimeout(() => {
          //logger.info('Disconnect delay elapsed, disconnecting call');
          //this.emit('disconnectCall');
        }, this.disconnectDelay);
      }
    }, timeUntilWarning);
  }

  cleanup() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }
    if (this.disconnectTimer) {
      clearTimeout(this.disconnectTimer);
    }
    this.isInitialized = false;
    this.warningLevel = 0;
    logger.info('Silence detector cleaned up');
  }
}
