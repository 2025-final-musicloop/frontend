"""
check_setup.py - 실행 환경 검증 스크립트

이 스크립트는 backend_model이 실행 가능한 환경인지 확인합니다.
"""

import sys
import os

def check_python_version():
    """Python 버전 확인"""
    version = sys.version_info
    print(f"[OK] Python 버전: {version.major}.{version.minor}.{version.micro}")
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("  [WARN] Python 3.8 이상이 필요합니다.")
        return False
    return True

def check_imports():
    """필수 패키지 import 확인"""
    required_packages = {
        'numpy': 'numpy',
        'librosa': 'librosa',
        'soundfile': 'soundfile',
        'crepe': 'crepe',
        'pretty_midi': 'pretty_midi',
    }
    
    optional_packages = {
        'fluidsynth': 'pyfluidsynth',
    }
    
    print("\n필수 패키지 확인:")
    all_ok = True
    for module_name, package_name in required_packages.items():
        try:
            __import__(module_name)
            print(f"  [OK] {package_name} 설치됨")
        except ImportError:
            print(f"  [FAIL] {package_name} 설치 필요: pip install {package_name}")
            all_ok = False
    
    print("\n선택 패키지 확인:")
    for module_name, package_name in optional_packages.items():
        try:
            __import__(module_name)
            print(f"  [OK] {package_name} 설치됨 (FluidSynth 사용 가능)")
        except ImportError:
            print(f"  [WARN] {package_name} 미설치 (pretty_midi 기본 합성 사용)")
    
    return all_ok

def check_tensorflow():
    """TensorFlow 확인 (CREPE 필요)"""
    try:
        import tensorflow as tf
        print(f"\n[OK] TensorFlow 버전: {tf.__version__}")
        return True
    except ImportError:
        print("\n[FAIL] TensorFlow 설치 필요: pip install tensorflow")
        return False

def check_soundfont():
    """SoundFont 파일 확인"""
    soundfont_paths = [
        "./soundfonts/FluidR3_GM.sf2",
        "../soundfonts/FluidR3_GM.sf2",
        "C:\\Windows\\System32\\drivers\\gm.dls",
        "/usr/share/soundfonts/default.sf2",
        "/usr/share/sounds/sf2/FluidR3_GM.sf2",
    ]
    
    print("\nSoundFont 파일 확인:")
    found = False
    for path in soundfont_paths:
        if os.path.exists(path):
            print(f"  [OK] SoundFont 발견: {path}")
            found = True
            break
    
    if not found:
        print("  [WARN] SoundFont 파일 없음 (pretty_midi 기본 합성 사용)")
        print("     다운로드: https://member.keymusician.com/Member/FluidR3MonoGM/SetDefault.aspx")
    
    return found

def check_directories():
    """필요한 디렉토리 확인"""
    dirs = ['../data', '../outputs', './soundfonts']
    print("\n디렉토리 확인:")
    for dir_path in dirs:
        if os.path.exists(dir_path):
            print(f"  [OK] {dir_path} 존재")
        else:
            print(f"  [WARN] {dir_path} 없음 (자동 생성됨)")
            try:
                os.makedirs(dir_path, exist_ok=True)
                print(f"     -> 생성됨")
            except Exception as e:
                print(f"     [FAIL] 생성 실패: {e}")

def check_fluidsynth_binary():
    """FluidSynth 바이너리 확인 (Windows)"""
    import subprocess
    print("\nFluidSynth 바이너리 확인:")
    try:
        result = subprocess.run(['fluidsynth', '--version'], 
                              capture_output=True, 
                              text=True, 
                              timeout=5)
        if result.returncode == 0:
            print(f"  [OK] FluidSynth 설치됨")
            print(f"     {result.stdout.strip()}")
            return True
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass
    
    print("  [WARN] FluidSynth 바이너리 없음 (pyfluidsynth만으로도 동작 가능)")
    return False

def main():
    """전체 검증 실행"""
    print("=" * 60)
    print("Backend Model 실행 환경 검증")
    print("=" * 60)
    
    checks = [
        ("Python 버전", check_python_version),
        ("필수 패키지", check_imports),
        ("TensorFlow", check_tensorflow),
        ("SoundFont", check_soundfont),
        ("디렉토리", check_directories),
    ]
    
    # Windows에서만 FluidSynth 바이너리 확인
    if sys.platform == 'win32':
        checks.append(("FluidSynth 바이너리", check_fluidsynth_binary))
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n[FAIL] {name} 확인 중 오류: {e}")
            results.append((name, False))
    
    print("\n" + "=" * 60)
    print("검증 결과 요약:")
    print("=" * 60)
    
    all_passed = True
    for name, result in results:
        status = "[OK] 통과" if result else "[FAIL] 실패"
        print(f"  {name}: {status}")
        if not result:
            all_passed = False
    
    print("\n" + "=" * 60)
    if all_passed:
        print("[SUCCESS] 모든 필수 항목이 준비되었습니다!")
        print("   실행 방법: python main.py input.wav")
    else:
        print("[WARN] 일부 항목이 누락되었습니다.")
        print("   requirements.txt를 확인하고 필요한 패키지를 설치하세요:")
        print("   pip install -r requirements.txt")
    print("=" * 60)

if __name__ == "__main__":
    main()

