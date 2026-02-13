"""
synth.py - Synthesize MIDI files to audio using FluidSynth

This module takes MIDI files and converts them to audio using FluidSynth
and SoundFont (.sf2) files for realistic instrument sounds.
"""

import os
import numpy as np
import soundfile as sf
import pretty_midi
from typing import Optional
try:
    import fluidsynth
except ImportError:
    print("Warning: fluidsynth not available. Please install pyfluidsynth.")
    fluidsynth = None


class MIDISynthesizer:
    """Synthesize MIDI files to audio using FluidSynth."""
    
    def __init__(self, sample_rate: int = 44100, soundfont_path: Optional[str] = None):
        """
        Initialize the synthesizer.
        
        Args:
            sample_rate: Output audio sample rate
            soundfont_path: Path to SoundFont (.sf2) file
        """
        self.sample_rate = sample_rate
        self.soundfont_path = soundfont_path
        
        # Try to find a default soundfont if none provided
        if not self.soundfont_path:
            self.soundfont_path = self._find_default_soundfont()
    
    def _find_default_soundfont(self) -> Optional[str]:
        """
        Try to find a default SoundFont file on the system.
        
        Returns:
            Path to a SoundFont file if found, None otherwise
        """
        common_paths = [
            "/usr/share/soundfonts/default.sf2",
            "/usr/share/sounds/sf2/FluidR3_GM.sf2",
            "/System/Library/Components/CoreAudio.component/Contents/Resources/gs_instruments.dls",
            "C:\\Windows\\System32\\drivers\\gm.dls",
            "./soundfonts/FluidR3_GM.sf2",
            "../soundfonts/FluidR3_GM.sf2"
        ]
        
        for path in common_paths:
            if os.path.exists(path):
                return path
        
        return None
    
    def synthesize_midi_pretty(self, midi_path: str, output_path: str) -> str:
        """
        Synthesize MIDI using pretty_midi's built-in synthesis.
        This is a fallback method when FluidSynth is not available.
        
        Args:
            midi_path: Path to input MIDI file
            output_path: Path for output audio file
            
        Returns:
            Path to the created audio file
        """
        print(f"Loading MIDI file: {midi_path}")
        pm = pretty_midi.PrettyMIDI(midi_path)
        
        print("Synthesizing audio using pretty_midi...")
        # Synthesize audio using pretty_midi's built-in synthesis
        audio = pm.synthesize(fs=self.sample_rate)
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save audio file
        sf.write(output_path, audio, self.sample_rate)
        print(f"Audio file saved to {output_path}")
        
        return output_path
    
    def synthesize_midi_fluidsynth(self, midi_path: str, output_path: str) -> str:
        """
        Synthesize MIDI using FluidSynth for higher quality audio.
        
        Args:
            midi_path: Path to input MIDI file
            output_path: Path for output audio file
            
        Returns:
            Path to the created audio file
        """
        if fluidsynth is None:
            raise ImportError("FluidSynth not available. Please install pyfluidsynth.")
        
        if not self.soundfont_path or not os.path.exists(self.soundfont_path):
            raise FileNotFoundError(f"SoundFont file not found: {self.soundfont_path}")
        
        print(f"Loading MIDI file: {midi_path}")
        pm = pretty_midi.PrettyMIDI(midi_path)
        
        print(f"Synthesizing audio using FluidSynth with SoundFont: {self.soundfont_path}")
        
        # Initialize FluidSynth
        fs = fluidsynth.Synth(samplerate=self.sample_rate)
        
        try:
            # Load SoundFont
            sfid = fs.sfload(self.soundfont_path)
            
            # Set up instruments for each MIDI track
            for i, instrument in enumerate(pm.instruments):
                fs.program_select(i, sfid, 0, instrument.program)
            
            # Calculate total duration
            total_duration = pm.get_end_time()
            
            # Create audio buffer
            audio_length = int(total_duration * self.sample_rate) + self.sample_rate  # Add 1 second buffer
            audio_buffer = []
            
            # Process MIDI events
            current_time = 0.0
            time_step = 1024 / self.sample_rate  # Process in small chunks
            
            while current_time < total_duration:
                # Play notes that should be active at current_time
                for i, instrument in enumerate(pm.instruments):
                    for note in instrument.notes:
                        # Note on
                        if abs(note.start - current_time) < time_step / 2:
                            fs.noteon(i, note.pitch, note.velocity)
                        # Note off
                        elif abs(note.end - current_time) < time_step / 2:
                            fs.noteoff(i, note.pitch)
                
                # Generate audio for this time step
                samples = fs.get_samples(1024)
                audio_buffer.extend(samples)
                
                current_time += time_step
            
            # Convert to numpy array and normalize
            audio = np.array(audio_buffer, dtype=np.float32)
            if len(audio) > 0:
                audio = audio / np.max(np.abs(audio))  # Normalize
            
        finally:
            # Clean up FluidSynth
            fs.delete()
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save audio file
        sf.write(output_path, audio, self.sample_rate)
        print(f"Audio file saved to {output_path}")
        
        return output_path
    
    def synthesize_midi(self, midi_path: str, output_path: str, use_fluidsynth: bool = True) -> str:
        """
        Synthesize MIDI to audio, choosing the best available method.
        
        Args:
            midi_path: Path to input MIDI file
            output_path: Path for output audio file
            use_fluidsynth: Whether to prefer FluidSynth over pretty_midi synthesis
            
        Returns:
            Path to the created audio file
        """
        if not os.path.exists(midi_path):
            raise FileNotFoundError(f"MIDI file not found: {midi_path}")
        
        try:
            if use_fluidsynth and fluidsynth is not None and self.soundfont_path:
                return self.synthesize_midi_fluidsynth(midi_path, output_path)
            else:
                print("Using pretty_midi synthesis (FluidSynth not available or not requested)")
                return self.synthesize_midi_pretty(midi_path, output_path)
        except Exception as e:
            print(f"Error with FluidSynth synthesis: {e}")
            print("Falling back to pretty_midi synthesis...")
            return self.synthesize_midi_pretty(midi_path, output_path)


def main():
    """Example usage of the MIDI synthesizer."""
    synthesizer = MIDISynthesizer()
    
    # Example synthesis
    input_midi = "../outputs/converted.mid"
    output_audio = "../outputs/synthesized.wav"
    
    if os.path.exists(input_midi):
        synthesizer.synthesize_midi(input_midi, output_audio)
    else:
        print(f"Example MIDI file not found: {input_midi}")
        print("Please run pitch2midi.py first to generate a MIDI file")


if __name__ == "__main__":
    main()
