"""
Create a simple test audio file for validation.
"""

import wave
import struct
import math
import os

def create_test_humming(filename="test_humming.wav", frequency=440, duration=2.0):
    """Create a simple sine wave audio file to simulate humming."""
    sample_rate = 22050
    num_samples = int(duration * sample_rate)
    
    # Generate sine wave with slight vibrato
    samples = []
    for i in range(num_samples):
        t = i / sample_rate
        # Add vibrato (slight frequency modulation)
        vibrato = 1 + 0.02 * math.sin(2 * math.pi * 5 * t)
        sample = int(16384 * math.sin(2 * math.pi * frequency * vibrato * t))
        samples.append(sample)
    
    # Write WAV file
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        
        for sample in samples:
            wav_file.writeframes(struct.pack('<h', sample))
    
    print(f"Created test audio file: {filename}")
    return filename

if __name__ == "__main__":
    # Create test file in data directory
    data_dir = "../data"
    os.makedirs(data_dir, exist_ok=True)
    
    test_file = os.path.join(data_dir, "test_humming.wav")
    create_test_humming(test_file, frequency=440, duration=3.0)  # A4 for 3 seconds
