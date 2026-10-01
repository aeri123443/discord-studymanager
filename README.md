# discord-studymanager

> 매일 자정에 스터디 인증 스레드를 자동으로 열어 주는 디스코드 봇

기상 인증 스터디에서 매일 날짜별 인증 스레드를 직접 만드는 번거로움을 줄이기 위해 만들었습니다.
매일 00:00(KST)에 지정한 채널에 **`N월 N일` 스레드를 생성**하고, 첫 메시지로 멤버별 목표 기상 시간을 올립니다.

> 파이썬으로 다시 만든 코딩테스트 스터디용 봇은 [discord-studymanager-python](https://github.com/aeri123443/discord-studymanager-python)에 있습니다.

## 주요 기능

- **매일 자동 실행**: `node-schedule`로 매일 00:00(KST)에 실행
- **날짜별 스레드 생성**: `7월 16일` 형식의 스레드를 만들고, 하루 뒤 자동 보관
- **멤버별 목표 표시**: 스레드 첫 메시지에 멤버 이름과 목표 기상 시간 작성
- **Firestore 연동** (`develop` 브랜치): 채널별 멤버 이름·목표를 Firestore에서 조회해 메시지 구성

## 동작 흐름

```
매일 00:00 (KST)
      ↓
대상 채널 조회 (텍스트 채널인지 확인)
      ↓
Firestore: channel/{채널ID}/user 에서 멤버 이름·목표 조회   ← develop
      ↓
"N월 N일" 스레드 생성 → 목표 기상 시간 메시지 전송
```

## 기술 스택

- Node.js, discord.js v14
- node-schedule
- Firebase Admin SDK (Firestore)
- dotenv

## 시작하기

### 1. 환경 변수

프로젝트 루트에 `.env` 파일을 만듭니다.

```env
DISCORD_TOKEN=<디스코드 봇 토큰>
TARGET_CHANNEL_ID=<스레드를 만들 채널 ID>
```

Firestore를 사용하는 경우(`develop`), Firebase 서비스 계정 키를 `serviceAccountKey.json`으로 루트에 저장합니다.
`.env`와 `serviceAccountKey.json`은 Git에 올리지 않습니다.

### 2. 실행

```bash
npm install
npm start
```

## Firestore 구조 (`develop`)

```
channel (collection)
└── {채널 ID} (document)
    └── user (collection)
        └── {유저 ID} (document)
            ├── name: string
            └── goal: string
```
