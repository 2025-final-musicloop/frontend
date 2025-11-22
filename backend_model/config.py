"""
config.py - Configuration settings for Hum-to-Music AI

This file contains default settings and configuration options
that can be customized for different use cases.
"""

import os

# Audio Processing Settings
AUDIO_CONFIG = {
    "sample_rate": 22050,           # Sample rate for pitch detection
    "synthesis_sample_rate": 44100,  # Sample rate for audio synthesis
    "hop_length": 512,              # Hop length for audio analysis
    "confidence_threshold": 0.5,     # Default confidence threshold for pitch detection
}

# CREPE Settings
CREPE_CONFIG = {
    "model_capacity": "medium",     # Options: 'tiny', 'small', 'medium', 'large', 'full'
    "viterbi": True,               # Use Viterbi smoothing
    "step_size": 10,               # Step size in milliseconds
}

# MIDI Settings
MIDI_CONFIG = {
    "default_velocity": 80,         # Default note velocity (0-127)
    "default_instrument": 0,        # Default MIDI instrument (0 = Piano)
    "note_duration_min": 0.1,      # Minimum note duration in seconds
}

# Synthesis Settings
SYNTHESIS_CONFIG = {
    "use_fluidsynth": True,        # Prefer FluidSynth over pretty_midi synthesis
    "default_soundfont_paths": [   # Common SoundFont locations
        "/usr/share/soundfonts/default.sf2",
        "/usr/share/sounds/sf2/FluidR3_GM.sf2",
        "C:\\Windows\\System32\\drivers\\gm.dls",
        "./soundfonts/FluidR3_GM.sf2",
        "../soundfonts/FluidR3_GM.sf2",
        "./FluidR3_GM.sf2",
    ],
}

# File Paths
PATHS = {
    "data_dir": "../data",
    "output_dir": "../outputs",
    "soundfont_dir": "../soundfonts",
}

# Instrument Presets
INSTRUMENT_PRESETS = {
    "piano": 0,
    "guitar_nylon": 24,
    "guitar_steel": 25,
    "violin": 40,
    "viola": 41,
    "cello": 42,
    "trumpet": 56,
    "trombone": 57,
    "flute": 73,
    "recorder": 74,
    "organ": 19,
    "harmonica": 22,
    "saxophone": 64,
    "clarinet": 71,
}

# Quality Presets
QUALITY_PRESETS = {
    "fast": {
        "crepe_model": "tiny",
        "sample_rate": 16000,
        "confidence_threshold": 0.6,
    },
    "balanced": {
        "crepe_model": "medium",
        "sample_rate": 22050,
        "confidence_threshold": 0.5,
    },
    "high_quality": {
        "crepe_model": "full",
        "sample_rate": 44100,
        "confidence_threshold": 0.4,
    },
}


def get_config(preset="balanced"):
    """
    Get configuration based on preset.
    
    Args:
        preset: Quality preset ('fast', 'balanced', 'high_quality')
        
    Returns:
        Configuration dictionary
    """
    config = {
        "audio": AUDIO_CONFIG.copy(),
        "crepe": CREPE_CONFIG.copy(),
        "midi": MIDI_CONFIG.copy(),
        "synthesis": SYNTHESIS_CONFIG.copy(),
        "paths": PATHS.copy(),
        "instruments": INSTRUMENT_PRESETS.copy(),
    }
    
    # Apply preset overrides
    if preset in QUALITY_PRESETS:
        preset_config = QUALITY_PRESETS[preset]
        config["crepe"]["model_capacity"] = preset_config["crepe_model"]
        config["audio"]["sample_rate"] = preset_config["sample_rate"]
        config["audio"]["confidence_threshold"] = preset_config["confidence_threshold"]
    
    return config


def find_soundfont():
    """Find the first available SoundFont file."""
    for path in SYNTHESIS_CONFIG["default_soundfont_paths"]:
        if os.path.exists(path):
            return path
    return None
