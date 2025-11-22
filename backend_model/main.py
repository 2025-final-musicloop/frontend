"""
main.py - Complete pipeline for converting humming to synthesized music

This script orchestrates the complete process:
1. Load humming audio
2. Convert to MIDI using pitch detection
3. Synthesize MIDI to realistic audio using FluidSynth

Author: Sergie Code - AI Tools for Musicians
"""

import os
import sys
import argparse
from typing import Optional

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from pitch2midi import HummingToMIDI
from synth import MIDISynthesizer


class HumToMusicPipeline:
    """Complete pipeline for converting humming to synthesized music."""
    
    def __init__(self, sample_rate: int = 22050, soundfont_path: Optional[str] = None):
        """
        Initialize the pipeline.
        
        Args:
            sample_rate: Audio sample rate for processing
            soundfont_path: Path to SoundFont file for synthesis
        """
        self.pitch_converter = HummingToMIDI(sample_rate=sample_rate)
        self.synthesizer = MIDISynthesizer(sample_rate=44100, soundfont_path=soundfont_path)
    
    def process_humming(self, input_audio_path: str, output_dir: str = "../outputs",
                       confidence_threshold: float = 0.5, instrument_program: int = 0,
                       use_fluidsynth: bool = True) -> dict:
        """
        Complete pipeline: humming audio → MIDI → synthesized audio.
        
        Args:
            input_audio_path: Path to input humming audio file
            output_dir: Directory for output files
            confidence_threshold: Minimum confidence for pitch detection
            instrument_program: MIDI instrument program number
            use_fluidsynth: Whether to use FluidSynth for synthesis
            
        Returns:
            Dictionary with paths to generated files
        """
        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate output file names
        base_name = os.path.splitext(os.path.basename(input_audio_path))[0]
        midi_path = os.path.join(output_dir, f"{base_name}.mid")
        audio_path = os.path.join(output_dir, f"{base_name}_synthesized.wav")
        
        print("=" * 60)
        print("HUM-TO-MUSIC AI PIPELINE")
        print("=" * 60)
        print(f"Input: {input_audio_path}")
        print(f"Output directory: {output_dir}")
        print(f"Instrument program: {instrument_program}")
        print(f"Confidence threshold: {confidence_threshold}")
        print()
        
        # Step 1: Convert humming to MIDI
        print("STEP 1: Converting humming to MIDI...")
        print("-" * 40)
        try:
            self.pitch_converter.convert_audio_to_midi(
                input_audio_path, 
                midi_path, 
                confidence_threshold=confidence_threshold,
                instrument_program=instrument_program
            )
        except Exception as e:
            print(f"Error in pitch-to-MIDI conversion: {e}")
            return {"error": str(e)}
        
        print()
        
        # Step 2: Synthesize MIDI to audio
        print("STEP 2: Synthesizing MIDI to audio...")
        print("-" * 40)
        try:
            self.synthesizer.synthesize_midi(
                midi_path, 
                audio_path, 
                use_fluidsynth=use_fluidsynth
            )
        except Exception as e:
            print(f"Error in MIDI synthesis: {e}")
            return {"error": str(e)}
        
        print()
        print("Pipeline completed successfully!")
        print("=" * 60)
        print("Generated files:")
        print(f"   MIDI: {midi_path}")
        print(f"   Audio: {audio_path}")
        print("=" * 60)
        
        return {
            "midi_path": midi_path,
            "audio_path": audio_path,
            "success": True
        }


def get_instrument_info():
    """Return information about available MIDI instruments."""
    instruments = {
        0: "Acoustic Grand Piano",
        1: "Bright Acoustic Piano",
        24: "Acoustic Guitar (nylon)",
        25: "Acoustic Guitar (steel)",
        40: "Violin",
        41: "Viola",
        42: "Cello",
        56: "Trumpet",
        57: "Trombone",
        73: "Flute",
        74: "Recorder"
    }
    return instruments


def main():
    """Main function with command-line interface."""
    parser = argparse.ArgumentParser(
        description="Convert humming audio to synthesized music",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py input.wav
  python main.py input.wav --instrument 40 --confidence 0.6
  python main.py input.wav --output ./my_outputs --no-fluidsynth
  
Available instruments (selection):
  0  - Acoustic Grand Piano (default)
  24 - Acoustic Guitar (nylon)
  40 - Violin
  56 - Trumpet
  73 - Flute
        """
    )
    
    parser.add_argument("input", nargs='?', help="Input humming audio file (WAV format)")
    parser.add_argument("--output", "-o", default="../outputs", 
                       help="Output directory (default: ../outputs)")
    parser.add_argument("--instrument", "-i", type=int, default=0,
                       help="MIDI instrument program number (default: 0 - Piano)")
    parser.add_argument("--confidence", "-c", type=float, default=0.5,
                       help="Minimum confidence threshold for pitch detection (default: 0.5)")
    parser.add_argument("--soundfont", "-s", type=str, default=None,
                       help="Path to SoundFont (.sf2) file")
    parser.add_argument("--no-fluidsynth", action="store_true",
                       help="Use pretty_midi synthesis instead of FluidSynth")
    parser.add_argument("--list-instruments", action="store_true",
                       help="List available MIDI instruments and exit")
    
    args = parser.parse_args()
    
    # List instruments if requested
    if args.list_instruments:
        print("Available MIDI Instruments (selection):")
        print("=" * 40)
        instruments = get_instrument_info()
        for program, name in instruments.items():
            print(f"{program:3d} - {name}")
        return
    
    # Validate input file is provided
    if not args.input:
        parser.error("Input file is required unless using --list-instruments")
    
    # Validate input file exists
    if not os.path.exists(args.input):
        print(f"Error: Input file not found: {args.input}")
        sys.exit(1)
    
    # Validate instrument program
    if not 0 <= args.instrument <= 127:
        print("Error: Instrument program must be between 0 and 127")
        sys.exit(1)
    
    # Validate confidence threshold
    if not 0.0 <= args.confidence <= 1.0:
        print("Error: Confidence threshold must be between 0.0 and 1.0")
        sys.exit(1)
    
    # Initialize and run pipeline
    pipeline = HumToMusicPipeline(soundfont_path=args.soundfont)
    
    result = pipeline.process_humming(
        input_audio_path=args.input,
        output_dir=args.output,
        confidence_threshold=args.confidence,
        instrument_program=args.instrument,
        use_fluidsynth=not args.no_fluidsynth
    )
    
    if "error" in result:
        print(f"Pipeline failed: {result['error']}")
        sys.exit(1)
    else:
        print("\nSuccess! Your humming has been converted to music!")
        print("   Use the generated MIDI and audio files in your favorite DAW or music application.")


if __name__ == "__main__":
    main()
