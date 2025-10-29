# server.py
# -*- coding: utf-8 -*-

"""
==============================================================================
 AI 음악 생성 통합 API 서버 (v3.0 - Demucs 버전)
==============================================================================
이 서버는 Flask를 기반으로 하며, 두 가지 주요 기능을 API로 제공합니다.
1. /generate-from-humming: 사용자의 허밍을 기반으로 새로운 음악을 생성합니다.
2. /convert-genre: Demucs를 사용하여 기존 음악 파일의 장르를 변환합니다.

[실행 방법]
1. Anaconda Prompt에서 가상환경 활성화: conda activate music_api_project
2. 서버 실행: python server.py
"""

# --- 1. 라이브러리 임포트 ---
from dotenv import load_dotenv

import os
import random
import base64
import werkzeug.utils
import subprocess # Demucs를 실행하기 위해 추가

# Flask 및 웹 관련
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# 오디오 및 음악 분석
import librosa
import numpy as np
import mido
from music21 import converter, analysis, tempo

# Google Cloud AI
from google.cloud import aiplatform
from google.protobuf import json_format
from google.protobuf.struct_pb2 import Value

# --- 2. Flask 애플리케이션 설정 ---
app = Flask(__name__)
CORS(app) # 다른 주소(React 앱)에서의 요청을 허용

# 파일 저장을 위한 폴더 설정
UPLOAD_FOLDER = 'uploads'
GENERATED_FOLDER = 'generated'
SEPARATED_FOLDER = 'demucs_output' # Demucs 결과물 폴더
FINAL_OUTPUT_FOLDER = 'final_output' # 병합된 최종 결과물 폴더
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GENERATED_FOLDER, exist_ok=True)
os.makedirs(SEPARATED_FOLDER, exist_ok=True)
os.makedirs(FINAL_OUTPUT_FOLDER, exist_ok=True)

# --- 3. Helper 함수 ---
NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
def midi_to_note_name(midi_note):
    """MIDI 노트 번호를 음이름으로 변환합니다."""
    octave = (midi_note // 12) - 1
    note_index = midi_note % 12
    return f"{NOTE_NAMES[note_index]}{octave}"
def get_leading_silence(audio_path, threshold_db=-40):
    """오디오 파일 시작 부분의 무음 구간 길이를 초 단위로 반환합니다."""
    print(f"무음 구간 분석 시작: {audio_path}")
    try:
        y, sr = librosa.load(audio_path, sr=None) # 원본 샘플링 레이트 유지
        # librosa.effects.trim은 앞뒤의 무음 구간을 제거한 오디오 배열의 시작/끝 인덱스를 반환
        _, index = librosa.effects.trim(y, top_db=abs(threshold_db))
        start_time_sec = index[0] / sr
        print(f"감지된 무음 구간 길이: {start_time_sec:.2f}초")
        return start_time_sec
    except Exception as e:
        print(f"무음 구간 분석 중 오류 발생: {e}. 무음 없음을 가정합니다.")
        return 0.0 # 오류 시 0초 반환


# --- 4. 백엔드 핵심 기능 함수들 ---

def separate_vocals_demucs(input_path, output_path):
    """[장르 변환 파이프라인 1단계] Demucs를 사용하여 음원에서 보컬과 반주를 분리합니다."""
    print(f"[1단계-분리] Demucs 음원 분리를 시작합니다: {input_path}")
    
    # Demucs는 커맨드 라인 인터페이스로 실행하는 것이 가장 안정적입니다.
    command = [
        "demucs",
        "--two-stems", "vocals", # <-- 'vocals'를 기준으로 분리하라고 명시
        "-o", output_path,
        input_path
    ]
    
    # 서브프로세스로 Demucs 명령어 실행
    subprocess.run(command, check=True)
    
    base_filename = os.path.splitext(os.path.basename(input_path))[0]
    # Demucs 최신 버전은 'htdemucs'라는 하위 폴더 안에 결과를 저장합니다.
    model_output_folder = os.path.join(output_path, 'htdemucs', base_filename)
    
    vocals_path = os.path.join(model_output_folder, 'vocals.wav')
    accompaniment_path = os.path.join(model_output_folder, 'no_vocals.wav') # Demucs는 반주를 'no_vocals'로 저장
    
    if not os.path.exists(vocals_path):
        raise Exception("음원 분리 후 보컬 파일을 찾을 수 없습니다. Demucs 출력 폴더 구조를 확인하세요.")
        
    print("[1단계-분리] 음원 분리 완료.")
    return vocals_path, accompaniment_path

def audio_to_midi(input_audio_path, output_midi_path):
    """[공통 파이프라인] 오디오(허밍/보컬) -> MIDI 변환"""
    print(f"오디오 분석 및 MIDI 변환 시작: {input_audio_path}")
    y, sr = librosa.load(input_audio_path, sr=22050)
    f0, _, _ = librosa.pyin(y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
    times = librosa.times_like(f0, sr=sr)
    notes = []
    min_note_duration = 0.1
    current_note_start_time = None
    current_note_pitches = []
    for i, time in enumerate(times):
        is_voiced = not np.isnan(f0[i])
        if is_voiced:
            if current_note_start_time is None: current_note_start_time = time
            current_note_pitches.append(f0[i])
        else:
            if current_note_start_time is not None:
                duration = time - current_note_start_time
                if duration >= min_note_duration:
                    median_pitch_hz = np.median(current_note_pitches)
                    midi_note = int(round(librosa.hz_to_midi(median_pitch_hz)))
                    notes.append((current_note_start_time, duration, midi_note, 100))
                current_note_start_time = None
                current_note_pitches = []
    if not notes: raise Exception("오디오 파일에서 노트를 감지할 수 없습니다.")
    mid = mido.MidiFile()
    track = mido.MidiTrack()
    mid.tracks.append(track)
    ticks_per_beat = mid.ticks_per_beat
    tempo_val = mido.bpm2tempo(120)
    last_event_time_sec = 0
    for start_sec, duration_sec, pitch, velocity in notes:
        delta_ticks = mido.second2tick(start_sec - last_event_time_sec, ticks_per_beat, tempo_val)
        track.append(mido.Message('note_on', note=pitch, velocity=velocity, time=int(delta_ticks)))
        duration_ticks = mido.second2tick(duration_sec, ticks_per_beat, tempo_val)
        track.append(mido.Message('note_off', note=pitch, velocity=velocity, time=int(duration_ticks)))
        last_event_time_sec = start_sec + duration_sec
    mid.save(output_midi_path)
    print(f"MIDI 파일 저장 성공: {output_midi_path}")
    return True

def midi_to_text_prompt_advanced(midi_path, genre, mood, instruments, custom_prompt):
    """
    (v3.4 - AI 악기 선택 버전)
    MIDI 분석 + 사용자 선택사항 조합.
    instruments가 비어있으면 AI에게 악기 선택을 지시합니다.
    """
    print(f"[2단계 시작] MIDI 분석 및 사용자 선택사항 조합 (AI 악기 선택)...")
    try:
        # --- 1. MIDI 파일 분석 (이전과 동일) ---
        score = converter.parse(midi_path)
        melody_part = score.parts[0]
        key = melody_part.analyze('key')
        key_name = f"{key.tonic.name} {key.mode}"
        tempo_bpm = 120
        # ... (이하 리듬, 윤곽 분석 등은 이전과 동일) ...
        note_durations = [n.duration.quarterLength for n in melody_part.flatten().notesAndRests if n.isNote]
        avg_duration = sum(note_durations) / len(note_durations) if note_durations else 1.0
        rhythm_desc = "a slow and lyrical rhythm"
        if avg_duration < 0.5: rhythm_desc = "a fast and lively rhythm"
        elif avg_duration < 1.0: rhythm_desc = "a moderately paced rhythm"
        pitches = [p.pitch.midi for p in melody_part.flatten().notes]
        intervals = [pitches[i] - pitches[i-1] for i in range(1, len(pitches))]
        upward_movement, downward_movement = sum(i > 0 for i in intervals), sum(i < 0 for i in intervals)
        contour_desc = "a relatively static contour"
        if upward_movement > downward_movement * 1.5: contour_desc = "a predominantly ascending contour"
        elif downward_movement > upward_movement * 1.5: contour_desc = "a predominantly descending contour"
        elif upward_movement + downward_movement > len(pitches) / 2: contour_desc = "a dynamic and varied contour"

        # --- 2. 사용자 선택사항 기반 프롬프트 생성 ---
        base_prompt = ""
        instrument_instruction = ""

        # 악기가 명시적으로 주어진 경우 (Huming 페이지 등)
        if instruments:
            instrument_text = ", ".join(instruments)
            if len(instruments) == 1:
                base_prompt = f"Generate a high-quality music piece for a SOLO {instrument_text}. The style should be a {genre} with a {mood} mood."
                instrument_instruction = f"CRITICAL INSTRUCTION: Use ONLY the {instrument_text} and no other instruments."
            else:
                base_prompt = f"Generate a professional, high-quality instrumental music piece in a {genre} style with a {mood} mood."
                instrument_instruction = f"CRITICAL INSTRUCTION: Use ONLY the following instruments: {instrument_text}."
        # 악기가 주어지지 않은 경우 (Genre Conversion 페이지) -> AI에게 선택 위임
        else:
            base_prompt = f"Generate a professional, high-quality instrumental music piece in a {genre} style with a {mood} mood."
            instrument_instruction = f"CRITICAL INSTRUCTION: Please select and use instruments that are most appropriate for the **{genre}** genre and **{mood}** mood."

        analysis_prompt = f" The music should be based on a user's humming, with these core characteristics: Key: approximately {key_name}. Tempo: around {round(tempo_bpm)} BPM. Rhythm: {rhythm_desc}. Melody Contour: {contour_desc}."

        final_prompt = base_prompt + instrument_instruction + analysis_prompt

        if custom_prompt:
            final_prompt += f" Additionally, please follow this special user request: '{custom_prompt}'"

        creative_spices = ["with a slightly unexpected chord progression.", "in a lo-fi style.", "featuring a surprising key change."]
        final_prompt += f" For a creative touch, please interpret this {random.choice(creative_spices)}"

        print("프롬프트 생성 성공.")
        return final_prompt
    except Exception as e:
        print(f"[2단계 오류] MIDI 분석 중 오류 발생: {e}")
        return f"A {mood} {genre} song." # 오류 시 단순 프롬프트

def generate_music_with_api(text_prompt, output_audio_path, project_id, location="us-central1"):
    """[공통 파이프라인] Text -> Music (API 호출)"""
    print(f"Google Cloud Lyria API 호출...")
    try: # --- 추가된 부분: try 블록 시작 ---
        client_options = {"api_endpoint": "us-central1-aiplatform.googleapis.com"}
        client = aiplatform.gapic.PredictionServiceClient(client_options=client_options)
        instance_dict = {"prompt": text_prompt}
        instance = json_format.ParseDict(instance_dict, Value())
        instances = [instance]
        parameters_dict = {"temperature": 0.95, "seed": random.randint(0, 2**32 - 1)}
        parameters = json_format.ParseDict(parameters_dict, Value())
        publisher_endpoint = "publishers/google/models/lyria-002"
        endpoint_path = f"projects/{project_id}/locations/{location}/{publisher_endpoint}"
        print(f"Lyria 모델에 요청 (Seed: {parameters_dict['seed']})")
        
        response = client.predict(endpoint=endpoint_path, instances=instances, parameters=parameters)
        
        predictions = response.predictions
        if not predictions: raise Exception("API가 아무런 결과물을 반환하지 않았습니다.")
        prediction_result = dict(predictions[0])
        encoded_audio = prediction_result['bytesBase64Encoded']
        audio_data = base64.b64decode(encoded_audio)
        with open(output_audio_path, 'wb') as f:
            f.write(audio_data)
        print(f"API로부터 생성된 오디오 파일 저장 성공: {output_audio_path}")
        return True
    
    # --- 추가된 부분: 표절 검사 오류를 특정하여 처리 ---
    except Exception as e:
        error_message = str(e)
        # 오류 메시지에 'recitation checks'라는 키워드가 포함되어 있는지 확인
        if 'recitation checks' in error_message.lower():
            print("!!! API 오류: 저작권 필터(Recitation Checks)에 의해 차단됨 !!!")
            # raise 구문 대신, 특정 오류 메시지를 담은 Exception을 다시 발생시킵니다.
            # 이 메시지는 나중에 jsonify 될 때 error_type으로 변환됩니다.
            raise ValueError("recitation_error: AI generated music similar to existing copyrighted material.")
        else:
            # 그 외의 다른 오류는 그대로 다시 발생시킵니다.
            raise e # 원래 오류를 그대로 전달

# --- 수정된 오디오 병합 함수 ---
def pad_and_merge_audio(vocals_path, accompaniment_path, output_path, silence_duration_sec):
    """
    FFmpeg를 사용하여 반주 앞에 무음을 추가한 뒤, 보컬과 병합합니다.
    """
    print(f"[4단계-병합] 반주 딜레이 및 병합 시작 (딜레이: {silence_duration_sec:.2f}초)")
    
    # 1. 반주 파일에 무음을 추가한 임시 파일 생성
    padded_accompaniment_path = os.path.join(GENERATED_FOLDER, f"padded_accomp_{random.randint(1000,9999)}.wav")
    silence_duration_ms = int(silence_duration_sec * 1000) # 밀리초로 변환
    
    pad_command = [
        "ffmpeg",
        "-i", accompaniment_path,
        # adelay 필터: 모든 채널에 지정된 시간(ms)만큼 딜레이 추가
        "-af", f"adelay={silence_duration_ms}|{silence_duration_ms}", 
        padded_accompaniment_path
    ]
    
    try:
        print("FFmpeg: 반주에 무음 추가 중...")
        subprocess.run(pad_command, check=True, capture_output=True, text=True)
        print("FFmpeg: 무음 추가 완료.")
    except Exception as e:
        print(f"!!! FFmpeg 무음 추가 오류: {getattr(e, 'stderr', e)} !!!")
        raise Exception(f"반주 딜레이 실패: {getattr(e, 'stderr', e)}")

    # 2. 원본 보컬과 '무음이 추가된' 반주를 병합
    merge_command = [
        "ffmpeg",
        "-i", vocals_path,
        "-i", padded_accompaniment_path, # 무음 추가된 반주 사용
        "-filter_complex", "amerge",
        "-ac", "2",
        output_path
    ]
    
    try:
        print("FFmpeg: 보컬과 딜레이된 반주 병합 중...")
        subprocess.run(merge_command, check=True, capture_output=True, text=True)
        print(f"[4단계-병합] 오디오 병합 완료: {output_path}")
    except Exception as e:
        print(f"!!! FFmpeg 병합 오류: {getattr(e, 'stderr', e)} !!!")
        raise Exception(f"오디오 병합 실패: {getattr(e, 'stderr', e)}")
    finally:
        # 임시 패딩 파일 삭제
        if os.path.exists(padded_accompaniment_path):
            os.remove(padded_accompaniment_path)
            print(f"임시 파일 삭제: {padded_accompaniment_path}")

    return True
# --- API 엔드포인트 수정 ---
# (/generate-from-humming 과 /convert-genre 두 엔드포인트 모두 수정 필요)


# --- 5. API 엔드포인트(주소) 정의 ---

@app.route('/generate-from-humming', methods=['POST'])
def generate_from_humming_endpoint():
    """[API 1] 허밍 기반 음악 생성 파이프라인"""
    print("\n--- 허밍 기반 음악 생성 요청 수신 ---")
    try:
        if 'audio' not in request.files: return jsonify({"error": "오디오 파일이 없습니다."}), 400
        audio_file = request.files['audio']
        genre, mood, instruments, custom_prompt = (
            request.form.get('genre'), request.form.get('mood'), 
            request.form.getlist('instruments[]'), request.form.get('custom_prompt')
        )
        filename = werkzeug.utils.secure_filename(audio_file.filename)
        audio_path = os.path.join(UPLOAD_FOLDER, filename)
        audio_file.save(audio_path)
        
        temp_midi_path = os.path.join(GENERATED_FOLDER, "temp_humming.mid")
        audio_to_midi(audio_path, temp_midi_path)
        
        text_prompt = midi_to_text_prompt_advanced(temp_midi_path, genre, mood, instruments, custom_prompt)
        
        gcp_project_id = os.environ.get('GCP_PROJECT_ID')
        if not gcp_project_id: raise Exception("GCP_PROJECT_ID 환경 변수가 설정되지 않았습니다.")
        
        final_audio_filename = f"humming_based_{random.randint(1000,9999)}.wav"
        final_audio_path = os.path.join(FINAL_OUTPUT_FOLDER, final_audio_filename)

        generate_music_with_api(text_prompt, final_audio_path, gcp_project_id)
        duration = librosa.get_duration(path=final_audio_path)
        
        return jsonify({
            "status": "success", 
            "audio_url": f"/final_music/{final_audio_filename}",
            "duration": duration 
        })
    except Exception as e:
        print(f"!!! 허밍 기반 생성 중 오류 발생: {e} !!!")
        return jsonify({"error": str(e)}), 500

# server_genre.py 파일 내부에 위치

@app.route('/convert-genre', methods=['POST'])
def convert_genre_endpoint():
    """
    [API 2] 장르 변환 파이프라인
    - Demucs로 음원 분리
    - 보컬 또는 반주에서 멜로디 추출 (연주곡 지원)
    - AI가 악기를 선택하도록 프롬프트 생성
    - Lyria API 호출 및 결과 반환
    - 표절 검사 오류 등 특정 오류 타입 반환
    """
    print("\n--- 장르 변환 요청 수신 ---")
    try:
        # --- 1. 프론트엔드로부터 데이터 수신 ---
        # 파일 존재 여부 확인
        if 'audio' not in request.files:
            # 파일이 없으면 400 Bad Request 오류 반환
            return jsonify({"error": "오디오 파일이 없습니다.", "error_type": "missing_file"}), 400
        audio_file = request.files['audio']

        # 폼 데이터에서 장르, 분위기, 추가 프롬프트 값 읽기 (없으면 기본값 사용)
        target_genre = request.form.get('genre', 'Rock')
        mood = request.form.get('mood', 'Energetic')
        custom_prompt = request.form.get('custom_prompt', '') # 기본값은 빈 문자열
        print(f"요청 정보: Genre='{target_genre}', Mood='{mood}', CustomPrompt='{custom_prompt[:30]}...'")

        # --- 2. 업로드된 파일 서버에 저장 ---
        # 안전한 파일 이름 생성 (보안 강화)
        filename = werkzeug.utils.secure_filename(audio_file.filename)
        # uploads 폴더에 파일 저장 경로 조합
        audio_path = os.path.join(UPLOAD_FOLDER, filename)
        # 파일 저장 실행
        audio_file.save(audio_path)
        print(f"업로드된 파일 저장 완료: {audio_path}")

        # --- 3. 장르 변환 핵심 파이프라인 실행 ---

        # 3-1. Demucs를 사용하여 음원 분리 (보컬 / 반주)
        print("음원 분리 시작...")
        # separate_vocals_demucs 함수는 분리된 보컬과 반주 파일의 경로를 반환
        vocals_path, accompaniment_path = separate_vocals_demucs(audio_path, SEPARATED_FOLDER)
        print(f"음원 분리 완료: 보컬({vocals_path}), 반주({accompaniment_path})")
        leading_silence_sec = get_leading_silence(vocals_path)

        # 3-2. 멜로디 추출 (보컬 우선, 실패 시 반주 사용)
        # 임시 MIDI 파일 경로 생성 (파일 이름 중복 방지 위해 랜덤 숫자 추가)
        temp_midi_path = os.path.join(GENERATED_FOLDER, f"temp_melody_{random.randint(1000,9999)}.mid")
        melody_source = "" # 멜로디를 어디서 추출했는지 기록할 변수

        try:
            # 먼저 보컬 파일에서 MIDI 추출 시도
            print("보컬 트랙에서 MIDI 추출 시도...")
            audio_to_midi(vocals_path, temp_midi_path)
            melody_source = "보컬"
            print("보컬 MIDI 추출 성공.")
        except Exception as e_vocal_midi:
            # 보컬 추출 실패 시 (예: 연주곡), 반주 파일에서 다시 시도
            print(f"보컬 MIDI 추출 실패 ({e_vocal_midi}), 반주 트랙에서 다시 시도...")
            try:
                audio_to_midi(accompaniment_path, temp_midi_path)
                melody_source = "반주"
                print("반주 MIDI 추출 성공.")
            except Exception as e_accomp_midi:
                # 반주 추출마저 실패하면, 더 이상 진행 불가
                print(f"반주 MIDI 추출마저 실패: {e_accomp_midi}")
                # 사용자에게 명확한 오류 메시지 전달
                raise Exception(f"음악 파일에서 멜로디를 추출할 수 없습니다: {e_accomp_midi}")

        # 3-3. MIDI -> Text (AI가 악기를 선택하도록 빈 리스트 전달)
        print(f"'{melody_source}' 멜로디 기반, AI가 악기를 선택하도록 프롬프트 생성...")
        # midi_to_text_prompt_advanced 함수는 instruments가 비어있으면 AI 선택 지시문을 추가함
        text_prompt = midi_to_text_prompt_advanced(temp_midi_path, target_genre, mood, [], custom_prompt)

        # 4. Text -> Music (새로운 반주 생성)
        gcp_project_id = os.environ.get('GCP_PROJECT_ID')
        new_accompaniment_filename = f"new_accomp_{random.randint(1000,9999)}.wav"
        new_accompaniment_path = os.path.join(GENERATED_FOLDER, new_accompaniment_filename)
        generate_music_with_api(text_prompt, new_accompaniment_path, gcp_project_id)
        
        # --- 5. 보컬 + 새 반주 병합 ---
        final_output_filename = f"final_converted_{random.randint(1000,9999)}.wav" # 최종 결과 파일명 (WAV)
        final_output_path = os.path.join(FINAL_OUTPUT_FOLDER, final_output_filename) # 최종 저장 위치
        pad_and_merge_audio(vocals_path, new_accompaniment_path, final_output_path, leading_silence_sec)

       

        # 3-5. 생성된 오디오 파일 길이 계산
        # librosa를 사용하여 파일 길이(초 단위)를 얻음
        duration = librosa.get_duration(path=final_output_path)
        print(f"생성된 음악 길이: {duration:.2f}초")

        # (향후 개선: 원본 보컬 + 새 반주 합치기 로직 추가 가능)

        # --- 4. 성공 응답 반환 ---
        print("--- 장르 변환 성공! 프론트엔드에 결과 반환 ---")
        # 프론트엔드에 성공 상태, 메시지, 파일 URL, 길이를 JSON 형태로 전달
        return jsonify({
            "status": "success",
            "message": "장르 변환이 완료되었습니다.",
            "audio_url": f"/final_music/{final_output_filename}", # 프론트엔드에서 접근할 URL
            "duration": duration
        })

    # --- 5. 오류 처리 ---
    # 특정 오류(ValueError) 처리: 표절 검사 등 의도적으로 발생시킨 오류
    except ValueError as ve:
        print(f"!!! 장르 변환 중 특정 오류 발생 (ValueError): {ve} !!!")
        # 오류 메시지 형식 "error_type: 상세 메시지" 를 파싱하여 프론트엔드에 전달
        error_parts = str(ve).split(":", 1)
        error_type = error_parts[0] if len(error_parts) > 1 else "value_error"
        error_message = error_parts[1].strip() if len(error_parts) > 1 else str(ve)
        # 400 Bad Request 상태 코드와 함께 오류 정보 반환
        return jsonify({"error": error_message, "error_type": error_type}), 400
    # 그 외 모든 예상치 못한 오류 처리
    except Exception as e:
        print(f"!!! 장르 변환 중 일반 오류 발생 (Exception): {e} !!!")
        # 500 Internal Server Error 상태 코드와 함께 일반 오류 정보 반환
        return jsonify({"error": f"서버 내부 처리 중 오류가 발생했습니다: {e}", "error_type": "internal_server_error"}), 500
    
# --- 6. 정적 파일 서빙 라우트 ---
@app.route('/music/<path:filename>')
def serve_generated_music(filename):
    """'generated' 폴더의 임시 생성 파일을 제공 (이전 버전 호환용)"""
    return send_from_directory(GENERATED_FOLDER, filename)

@app.route('/final_music/<path:filename>')
def serve_final_music(filename):
    """'final_output' 폴더의 최종 병합된 파일을 제공"""
    return send_from_directory(FINAL_OUTPUT_FOLDER, filename)


# --- 6. 서버 실행 ---
if __name__ == '__main__':
    # !!! 중요 !!!
    # GCP 인증을 위한 환경 변수를 설정합니다. 
    load_dotenv() # .env
    
    # 서버를 실행합니다. debug=True는 개발 중에 코드가 바뀌면 서버가 자동 재시작되게 합니다.
    # host='0.0.0.0'은 컴퓨터의 모든 IP 주소에서 접속을 허용합니다.
    app.run(host='0.0.0.0', port=5000, debug=True,use_reloader=False)