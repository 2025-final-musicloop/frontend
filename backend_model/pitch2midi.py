"""
pitch2midi.py - Convert humming audio to MIDI using pitch detection

This module processes audio files containing humming and converts them to MIDI format
using CREPE for pitch detection and pretty_midi for MIDI generation.
"""

import numpy as np
import librosa
import soundfile as sf
import crepe
import pretty_midi
from typing import Tuple, Optional
import os


class HummingToMIDI:
    """Convert humming audio to MIDI using pitch detection."""
    
    def __init__(self, sample_rate: int = 22050, hop_length: int = 512):
        """
        Initialize the converter.
        
        Args:
            sample_rate: Target sample rate for audio processing
            hop_length: Hop length for pitch detection
        """
        self.sample_rate = sample_rate
        self.hop_length = hop_length
    
    def load_audio(self, audio_path: str) -> Tuple[np.ndarray, int]:
        """
        Load audio file and convert to mono.
        
        Args:
            audio_path: Path to the audio file
            
        Returns:
            Tuple of (audio_data, sample_rate)
        """
        try:
            audio, sr = librosa.load(audio_path, sr=self.sample_rate, mono=True)
            return audio, sr
        except Exception as e:
            raise ValueError(f"Error loading audio file {audio_path}: {e}")
    
    def detect_pitch(self, audio: np.ndarray, sr: int) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Detect pitch using CREPE.
        
        Args:
            audio: Audio signal
            sr: Sample rate
            
        Returns:
            Tuple of (time_stamps, frequencies, confidence)
        """
        # Use CREPE for pitch detection
        time_stamps, frequencies, confidence, _ = crepe.predict(
            audio, 
            sr, 
            model_capacity='medium',
            viterbi=True,
            step_size=10  # 10ms steps
        )
        
        return time_stamps, frequencies, confidence
    
    def frequencies_to_midi_notes(self, frequencies: np.ndarray, confidence: np.ndarray, 
                                confidence_threshold: float = 0.5) -> np.ndarray:
        """
        Convert frequencies to MIDI note numbers.
        
        Args:
            frequencies: Array of frequencies in Hz
            confidence: Confidence scores for each frequency
            confidence_threshold: Minimum confidence to consider a note
            
        Returns:
            Array of MIDI note numbers
        """
        # Filter out low-confidence detections
        valid_mask = confidence > confidence_threshold
        midi_notes = np.full_like(frequencies, -1)  # -1 for silent/invalid notes
        
        # Convert frequencies to MIDI note numbers
        # MIDI note number = 12 * log2(f / 440) + 69
        valid_frequencies = frequencies[valid_mask]
        if len(valid_frequencies) > 0:
            midi_notes[valid_mask] = 12 * np.log2(valid_frequencies / 440.0) + 69
            midi_notes[valid_mask] = np.round(midi_notes[valid_mask]).astype(int)
            
            # Clamp to valid MIDI range (0-127)
            midi_notes = np.clip(midi_notes, 0, 127)
        
        return midi_notes
    
    def create_midi_from_notes(self, time_stamps: np.ndarray, midi_notes: np.ndarray, 
                              instrument_program: int = 0) -> pretty_midi.PrettyMIDI:
        """
        Create a MIDI file from detected notes.
        
        Args:
            time_stamps: Time stamps for each note
            midi_notes: MIDI note numbers (-1 for silence)
            instrument_program: MIDI instrument program number
            
        Returns:
            PrettyMIDI object
        """
        # Create a new MIDI file
        pm = pretty_midi.PrettyMIDI()
        
        # Create an instrument
        instrument = pretty_midi.Instrument(program=instrument_program)
        
        # Group consecutive identical notes
        current_note = None
        note_start = None
        
        for i, (time, note) in enumerate(zip(time_stamps, midi_notes)):
            if note != -1 and note != current_note:
                # End previous note if it exists
                if current_note is not None and note_start is not None:
                    note_obj = pretty_midi.Note(
                        velocity=80,
                        pitch=int(current_note),
                        start=note_start,
                        end=time
                    )
                    instrument.notes.append(note_obj)
                
                # Start new note
                current_note = note
                note_start = time
            elif note == -1 and current_note is not None:
                # End current note due to silence
                note_obj = pretty_midi.Note(
                    velocity=80,
                    pitch=int(current_note),
                    start=note_start,
                    end=time
                )
                instrument.notes.append(note_obj)
                current_note = None
                note_start = None
        
        # Handle the last note
        if current_note is not None and note_start is not None:
            note_obj = pretty_midi.Note(
                velocity=80,
                pitch=int(current_note),
                start=note_start,
                end=time_stamps[-1]
            )
            instrument.notes.append(note_obj)
        
        pm.instruments.append(instrument)
        return pm
    
    def convert_audio_to_midi(self, audio_path: str, output_path: str, 
                            confidence_threshold: float = 0.5, 
                            instrument_program: int = 0) -> str:
        """
        Complete pipeline: audio file to MIDI file.
        
        Args:
            audio_path: Path to input audio file
            output_path: Path for output MIDI file
            confidence_threshold: Minimum confidence for pitch detection
            instrument_program: MIDI instrument program number
            
        Returns:
            Path to the created MIDI file
        """
        print(f"Loading audio from {audio_path}...")
        audio, sr = self.load_audio(audio_path)
        
        print("Detecting pitch...")
        time_stamps, frequencies, confidence = self.detect_pitch(audio, sr)
        
        print("Converting frequencies to MIDI notes...")
        midi_notes = self.frequencies_to_midi_notes(frequencies, confidence, confidence_threshold)
        
        print("Creating MIDI file...")
        pm = self.create_midi_from_notes(time_stamps, midi_notes, instrument_program)
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save MIDI file
        pm.write(output_path)
        print(f"MIDI file saved to {output_path}")
        
        return output_path


def main():
    """Example usage of the HummingToMIDI converter."""
    converter = HummingToMIDI()
    
    # Example conversion
    input_audio = "../data/humming_sample.wav"
    output_midi = "../outputs/converted.mid"
    
    if os.path.exists(input_audio):
        converter.convert_audio_to_midi(input_audio, output_midi)
    else:
        print(f"Example audio file not found: {input_audio}")
        print("Please place a WAV file with humming in the data/ directory")


if __name__ == "__main__":
    main()
