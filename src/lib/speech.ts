/**
 * Reads copy aloud with the browser's built-in speech synthesis.
 *
 * Kids mode targets children who cannot read yet, so every label the UI shows
 * is also spoken. This uses `speechSynthesis`, which ships with the browser —
 * no network call, no API key, and no extra dependency.
 */

/** Conversational pace loses a five-year-old; this is deliberately slower. */
const KIDS_RATE = 0.85;

function synth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

export function speechSupported(): boolean {
  return synth() !== null;
}

/**
 * Chrome fills the voice list asynchronously, so the very first `getVoices()`
 * returns an empty array. The list is cached here and refreshed once the
 * browser announces it, rather than re-querying on every phrase.
 */
let voiceCache: SpeechSynthesisVoice[] = [];
let subscribed = false;

function voices(): SpeechSynthesisVoice[] {
  const speech = synth();
  if (!speech) return [];
  if (!subscribed) {
    subscribed = true;
    speech.addEventListener("voiceschanged", () => {
      voiceCache = speech.getVoices();
    });
  }
  if (voiceCache.length === 0) voiceCache = speech.getVoices();
  return voiceCache;
}

/** Exact BCP-47 match first, then any voice sharing the language prefix. */
function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const list = voices();
  const prefix = lang.split("-")[0];
  const normalise = (tag: string) => tag.replace("_", "-");
  return (
    list.find((voice) => normalise(voice.lang) === lang) ??
    list.find((voice) => normalise(voice.lang).startsWith(prefix)) ??
    null
  );
}

/**
 * Speaks `text`, replacing anything still being read. Children tap far faster
 * than a sentence takes to finish, and the default behaviour is to queue —
 * without the cancel, taps would stack into a backlog minutes long.
 */
export function speak(text: string, lang: string) {
  const speech = synth();
  if (!speech || !text.trim()) return;
  speech.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = KIDS_RATE;
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;
  speech.speak(utterance);
}

export function stopSpeaking() {
  synth()?.cancel();
}
