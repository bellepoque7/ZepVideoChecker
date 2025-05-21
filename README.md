# ZepVideoChecker
- Zep에서 우측 상단 카메라가 추가되는 것을 인지하여 소리 알람을 주는 크롬확장 프로그램  

# 설치방법

- 크롬웹브라우저에서 chrome://extensions/ 로 이동
- 우측 상단 개발자 모드 toggle on
- 좌측 상단 압축된 확장 프로그램을 로드합니다.
![image](https://github.com/user-attachments/assets/484352fd-8f2e-42fd-93a5-bfec886f90aa)

- 우측 상단 크롬 확장 프로그램 버튼 클릭
- 압정 버튼 눌러 고정 📍
- 우측 상단 벨 모양 눌러 로딩 확인 🔔
<img src="https://github.com/user-attachments/assets/cbaa93cd-8557-4a22-904b-ceca2b28b244" alt="image" width="300" />
- 크롬 재시작

# 기능
- on off
- 볼륨 조절

# 유의사항

- 크롬 동작만 확인하였습니다.
- 기본 볼륨 설정이 0.5 인데 확인해보시고 content.js > videoAlarmSound.volume 값 수정, popup.html > volumeSilider의 기본 값 수정하셔서 사용하시면 될 것 같습니다.
- 튜터 이름 부분에는 본인의 Zep 이름을 입력해주세요. (해당 이름은 오늘 방문자 수에 카운트 되지 않습니다.)
- 일이 끝나는 시간은 24시간 기준으로 입력해주세요. (오후 6시 = 18

# 기능개선 아이디어

<pre>
[ZEP 웹 브라우저]
└── 크롬 확장 프로그램 (content script)
    ├── 입장 감지 (카메라 아이콘 등 DOM 변화 감지)
    ├── 이벤트 발생 시 서버로 정보 전송
    ↓
[백엔드 서버 (Firebase / Flask 등)]
├── 로그 저장 (DB)
└── 모바일 알림 전송 (FCM, Pushover 등)

[모바일 기기 (Android / iOS)]
└── 알림 앱 or PWA 푸시 수신
</pre>


# Thnask to 
- made by 단기심화 남동현 튜터
- edit by 데이터 부트캠프 임정 튜터
