/**
 * Notification Service
 * Handles browser notifications and sounds for new messages
 * Also integrates with push notifications for background delivery
 */

import { pushNotificationService } from "./pushNotificationService";

export class NotificationService {
  private static instance: NotificationService;
  private permissionGranted = false;
  private enabled = true;
  private soundEnabled = true;
  private receiveSoundAudio: HTMLAudioElement | null = null;
  private sentSoundAudio: HTMLAudioElement | null = null;

  private constructor() {
    // Load preferences from localStorage first
    const enabledPref = localStorage.getItem("notifications-enabled");
    if (enabledPref !== null) {
      this.enabled = enabledPref === "true";
    }

    const soundPref = localStorage.getItem("notifications-sound-enabled");
    if (soundPref !== null) {
      this.soundEnabled = soundPref === "true";
    }

    this.checkPermission();
    this.initializeSounds();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize audio elements for notification sounds
   */
  private initializeSounds(): void {
    try {
      // Try to create audio elements for notification sounds
      this.receiveSoundAudio = new Audio("/sounds/message-receive.mp3");
      this.sentSoundAudio = new Audio("/sounds/message-sent.mp3");

      // Set up error handlers to use generated tones as fallback
      this.receiveSoundAudio.addEventListener("error", () => {
        console.log(
          "Message receive audio file not found, using generated tone",
        );
        this.receiveSoundAudio = this.createToneAudio(800, 0.1); // Higher pitch
      });

      this.sentSoundAudio.addEventListener("error", () => {
        console.log("Message sent audio file not found, using generated tone");
        this.sentSoundAudio = this.createToneAudio(600, 0.1); // Lower pitch
      });

      // Preload the sounds
      this.receiveSoundAudio.load();
      this.sentSoundAudio.load();
    } catch (error) {
      console.error("Error initializing notification sounds:", error);
    }
  }

  /**
   * Create a simple beep tone using Web Audio API
   */
  private createToneAudio(
    frequency: number,
    duration: number,
  ): HTMLAudioElement {
    const sampleRate = 44100;
    const numSamples = Math.floor(duration * sampleRate);
    const audioContext = new OfflineAudioContext(1, numSamples, sampleRate);

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    // Envelope for smooth fade out
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration,
    );

    oscillator.start(0);
    oscillator.stop(duration);

    const audio = new Audio();

    void audioContext.startRendering().then((renderedBuffer) => {
      const wav = this.audioBufferToWav(renderedBuffer);
      audio.src = URL.createObjectURL(wav);
    });

    return audio;
  }

  /**
   * Convert AudioBuffer to WAV Blob
   */
  private audioBufferToWav(buffer: AudioBuffer): Blob {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    const channels: Float32Array[] = [];
    let offset = 0;
    let pos = 0;

    // Write WAVE header
    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };
    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    // "RIFF" chunk descriptor
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    // "fmt " sub-chunk
    setUint32(0x20746d66); // "fmt "
    setUint32(16); // chunk length
    setUint16(1); // PCM
    setUint16(buffer.numberOfChannels);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels);
    setUint16(buffer.numberOfChannels * 2);
    setUint16(16);

    // "data" sub-chunk
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    // Write interleaved data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        const sample = Math.max(-1, Math.min(1, channels[i][offset]));
        view.setInt16(
          pos,
          sample < 0 ? sample * 0x8000 : sample * 0x7fff,
          true,
        );
        pos += 2;
      }
      offset++;
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  }

  /**
   * Play notification sound
   */
  async playSound(type: "receive" | "sent"): Promise<void> {
    if (!this.soundEnabled) {
      return;
    }

    try {
      const audio =
        type === "receive" ? this.receiveSoundAudio : this.sentSoundAudio;

      if (audio) {
        // Reset audio to start
        audio.currentTime = 0;
        // Play the sound
        await audio.play();
      }
    } catch (error) {
      // Ignore autoplay errors - user needs to interact with page first
      console.log("Audio play failed:", error);
    }
  }

  /**
   * Request notification permission from the user
   */
  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      this.permissionGranted = true;
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === "granted";
      return this.permissionGranted;
    }

    return false;
  }

  /**
   * Check current notification permission
   */
  private checkPermission(): void {
    if ("Notification" in window) {
      this.permissionGranted = Notification.permission === "granted";
    }
  }

  /**
   * Get current permission status
   */
  getPermissionStatus(): NotificationPermission | "unsupported" {
    if (!("Notification" in window)) {
      return "unsupported";
    }
    return Notification.permission;
  }

  /**
   * Show a notification for a new message
   * Uses Service Worker notification for better background support (Ramapay, etc.)
   */
  showMessageNotification(options: {
    title: string;
    body: string;
    icon?: string;
    tag?: string;
    conversationId?: string;
    onClick?: () => void;
  }): void {
    if (!this.enabled || !this.permissionGranted) {
      return;
    }

    // Don't show notification if tab is focused
    if (document.hasFocus()) {
      return;
    }

    // Play receive sound
    void this.playSound("receive");

    // Try to use Service Worker notification first (better for in-app browsers like Ramapay)
    // This has better support for background/locked screen notifications
    void this.showServiceWorkerNotification(options).catch(() => {
      // Fallback to regular Notification API
      this.showFallbackNotification(options);
    });
  }

  /**
   * Show notification via Service Worker (better for background/in-app browser support)
   */
  private async showServiceWorkerNotification(options: {
    title: string;
    body: string;
    icon?: string;
    tag?: string;
    conversationId?: string;
    onClick?: () => void;
  }): Promise<void> {
    // Check if push notification service is available
    if (pushNotificationService.isPushSupported()) {
      try {
        await pushNotificationService.showLocalNotification(options.title, {
          body: options.body,
          icon: options.icon || "/icons/icon-192x192.png",
          badge: "/icons/icon-192x192.png",
          tag: options.tag || `message-${Date.now()}`,
          data: {
            url: options.conversationId
              ? `/dm/${options.conversationId}`
              : "/conversations",
            conversationId: options.conversationId,
          },
        });
        return;
      } catch (error) {
        console.log("[Notification] SW notification failed, using fallback");
      }
    }
    throw new Error("SW notification not available");
  }

  /**
   * Fallback to regular Notification API
   */
  private showFallbackNotification(options: {
    title: string;
    body: string;
    icon?: string;
    tag?: string;
    conversationId?: string;
    onClick?: () => void;
  }): void {
    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        tag: options.tag || `message-${Date.now()}`,
        requireInteraction: false,
        silent: false,
      });

      if (options.onClick) {
        notification.onclick = () => {
          window.focus();
          options.onClick?.();
          notification.close();
        };
      }

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  }

  /**
   * Play sound when message is sent
   */
  playSentMessageSound(): void {
    void this.playSound("sent");
  }

  /**
   * Enable or disable notification sounds
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    localStorage.setItem("notifications-sound-enabled", enabled.toString());
  }

  /**
   * Check if sounds are enabled
   */
  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  /**
   * Enable or disable notifications
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    localStorage.setItem("notifications-enabled", enabled.toString());
  }

  /**
   * Check if notifications are enabled
   */
  isEnabled(): boolean {
    const stored = localStorage.getItem("notifications-enabled");
    if (stored !== null) {
      this.enabled = stored === "true";
    }
    return this.enabled;
  }

  /**
   * Show a test notification
   */
  showTestNotification(): void {
    this.showMessageNotification({
      title: "MumbleChat",
      body: "Notifications are working! You'll be notified of new messages.",
      icon: "/icons/icon-192x192.png",
    });
  }
}

export const notificationService = NotificationService.getInstance();
