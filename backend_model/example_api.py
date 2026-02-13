"""
example_api.py - Example of using Hum-to-Music AI as a library

This demonstrates how to integrate the hum-to-music functionality
into your own applications.
"""

import os
import sys
from pathlib import Path

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import HumToMusicPipeline
from config import get_config, INSTRUMENT_PRESETS


def basic_example():
    """Basic usage example."""
    print("🎵 Basic Example")
    print("-" * 30)
    
    # Initialize pipeline
    pipeline = HumToMusicPipeline()
    
    # Check if example file exists
    input_file = "../data/humming_sample.wav"
    if not os.path.exists(input_file):
        print(f"❌ Example file not found: {input_file}")
        print("   Place a WAV file with humming in the data/ directory")
        return
    
    # Process the file
    result = pipeline.process_humming(
        input_audio_path=input_file,
        output_dir="../outputs",
        instrument_program=0,  # Piano
        confidence_threshold=0.5
    )
    
    if result.get("success"):
        print(f"✅ Success! Generated:")
        print(f"   MIDI: {result['midi_path']}")
        print(f"   Audio: {result['audio_path']}")
    else:
        print(f"❌ Error: {result.get('error', 'Unknown error')}")


def batch_processing_example():
    """Process multiple files with different instruments."""
    print("\n🎼 Batch Processing Example")
    print("-" * 30)
    
    # Define input files and their target instruments
    files_and_instruments = [
        ("melody1.wav", "piano"),
        ("melody2.wav", "violin"),
        ("melody3.wav", "flute"),
    ]
    
    pipeline = HumToMusicPipeline()
    
    for filename, instrument_name in files_and_instruments:
        input_path = f"../data/{filename}"
        
        if not os.path.exists(input_path):
            print(f"⏭️  Skipping {filename} (not found)")
            continue
        
        print(f"🎵 Processing {filename} as {instrument_name}...")
        
        instrument_program = INSTRUMENT_PRESETS.get(instrument_name, 0)
        
        result = pipeline.process_humming(
            input_audio_path=input_path,
            output_dir=f"../outputs/{instrument_name}",
            instrument_program=instrument_program,
            confidence_threshold=0.5
        )
        
        if result.get("success"):
            print(f"✅ {filename} → {instrument_name} completed")
        else:
            print(f"❌ {filename} failed: {result.get('error')}")


def quality_comparison_example():
    """Process the same file with different quality settings."""
    print("\n🎯 Quality Comparison Example")
    print("-" * 30)
    
    input_file = "../data/humming_sample.wav"
    if not os.path.exists(input_file):
        print(f"❌ Example file not found: {input_file}")
        return
    
    quality_settings = [
        ("fast", 0.6),
        ("balanced", 0.5),
        ("high_quality", 0.4),
    ]
    
    for quality, confidence in quality_settings:
        print(f"🔄 Processing with {quality} settings...")
        
        # Get quality preset configuration
        config = get_config(quality)
        
        # Initialize pipeline with quality settings
        pipeline = HumToMusicPipeline(
            sample_rate=config["audio"]["sample_rate"]
        )
        
        result = pipeline.process_humming(
            input_audio_path=input_file,
            output_dir=f"../outputs/quality_{quality}",
            confidence_threshold=confidence,
            instrument_program=0
        )
        
        if result.get("success"):
            print(f"✅ {quality} quality completed")
        else:
            print(f"❌ {quality} quality failed")


def api_integration_example():
    """Example of how to integrate into a web API."""
    print("\n🌐 API Integration Example")
    print("-" * 30)
    
    def process_humming_api(audio_file_path, instrument="piano", quality="balanced"):
        """
        API function that could be called from Flask/FastAPI/Django.
        
        Args:
            audio_file_path: Path to uploaded audio file
            instrument: Instrument name or MIDI program number
            quality: Quality preset ('fast', 'balanced', 'high_quality')
            
        Returns:
            Dictionary with result information
        """
        try:
            # Get configuration
            config = get_config(quality)
            
            # Initialize pipeline
            pipeline = HumToMusicPipeline(
                sample_rate=config["audio"]["sample_rate"]
            )
            
            # Determine instrument program
            if isinstance(instrument, str):
                instrument_program = INSTRUMENT_PRESETS.get(instrument, 0)
            else:
                instrument_program = int(instrument)
            
            # Process the audio
            result = pipeline.process_humming(
                input_audio_path=audio_file_path,
                output_dir="../outputs/api",
                instrument_program=instrument_program,
                confidence_threshold=config["audio"]["confidence_threshold"]
            )
            
            return {
                "success": result.get("success", False),
                "midi_file": result.get("midi_path"),
                "audio_file": result.get("audio_path"),
                "error": result.get("error")
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    # Example usage
    example_file = "../data/humming_sample.wav"
    if os.path.exists(example_file):
        result = process_humming_api(example_file, "violin", "balanced")
        print(f"API Result: {result}")
    else:
        print("❌ No example file available for API demo")


def custom_pipeline_example():
    """Example of customizing the pipeline components."""
    print("\n🔧 Custom Pipeline Example")
    print("-" * 30)
    
    # Import individual components
    from pitch2midi import HummingToMIDI
    from synth import MIDISynthesizer
    
    # Custom pitch detection settings
    pitch_converter = HummingToMIDI(
        sample_rate=44100,  # Higher sample rate
        hop_length=256      # Smaller hop length for more precision
    )
    
    # Custom synthesis settings
    synthesizer = MIDISynthesizer(
        sample_rate=48000,  # Professional sample rate
        soundfont_path="../soundfonts/FluidR3_GM.sf2"
    )
    
    input_file = "../data/humming_sample.wav"
    if not os.path.exists(input_file):
        print(f"❌ Example file not found: {input_file}")
        return
    
    # Step 1: Custom pitch detection
    print("🎤 Custom pitch detection...")
    midi_path = "../outputs/custom_pipeline.mid"
    pitch_converter.convert_audio_to_midi(
        input_file,
        midi_path,
        confidence_threshold=0.3,  # Lower threshold for more notes
        instrument_program=73      # Flute
    )
    
    # Step 2: Custom synthesis
    print("🎹 Custom synthesis...")
    audio_path = "../outputs/custom_pipeline.wav"
    synthesizer.synthesize_midi(midi_path, audio_path)
    
    print("✅ Custom pipeline completed!")


def main():
    """Run all examples."""
    print("🎵 Hum-to-Music AI - API Examples")
    print("=" * 50)
    
    # Run examples
    basic_example()
    batch_processing_example()
    quality_comparison_example()
    api_integration_example()
    custom_pipeline_example()
    
    print("\n🎉 All examples completed!")
    print("\nThese examples show how to:")
    print("• Use the basic pipeline")
    print("• Process multiple files")
    print("• Adjust quality settings")
    print("• Integrate into web APIs")
    print("• Customize pipeline components")


if __name__ == "__main__":
    main()
