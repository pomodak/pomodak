## 완료된 기능

- 인증

  - 회원가입
  - 로그인
  - 패스워드 찾기
  - 토큰 리프레시
  - 구글 간편로그인
  - 카카오 간편로그인
  - 네이버 간편로그인

- 유저
  - 이름, 상태 메시지 수정
  - 보유중인 캐릭터 장착 (프로필 이미지를 사용한 수정)
  - 캘린더
    - 공부 기록이 존재하는 날짜에 스티커&시간 표시
    - 달력 오른쪽 밑에 현재 달에 공부한 날과 총 시간 표시 (월 통계)
    - 하단에 현재 선택 된 날짜의 총 공부시간 표시 (일 통계)
  - 스트릭(잔디)
    - 1년치 잔디 표시 (왼쪽에 월 표시)
    - heatMap 데이터를 바탕으로 잔디 표시
    - 현재 유저의 팔레트 표시 (딸기우유 팔레트, 민트초코 팔레트)
    - 팔레트 색상에 맞게 잔디 색칠 (null이면 default 초록색)
    - 잔디 클릭 시 일 통계 표시
- 스터디 타이머

  - 타이머 시작 (공부 타이머라면 서버에 기록)
  - 타이머 중단 (공부 타이머라면 서버에 기록)
  - 함께 공부하기 on/off

- 뽀모도로 타이머

  - 타이머 종료 시 백그라운드 상태라면 푸시알림(fcm)
  - 섹션 사이클 기능 - ex. 집중횟수 3 = 공부-휴식-공부-휴식-공부
  - 휴식시간 넘기기 기능

  - 타이머 옵션 설정
    - 공부 시간, 휴식 시간
    - 한 섹션당 집중 횟수 수
    - 설정 변경 시 현재 기록중인 섹션 초기화 (2 집중에서 0으로 초기화됨)

- 공부 같이하기 (최대 8명)

  - 공부 타이머 시작 시 그룹 참여 (소켓 통신)
  - 종료 시 그룹에서 나가짐
  - 각자 공부중인 시간 표시
  - 유저의 프로필 이미지를 캐릭터 장착 개념으로 사용

- 상점
  - 아이템/음식 구매
- 인벤토리

  - 사용 아이템 소모 - 각 아이템에 맞는 효과 실행
    - 음식 - 랜덤 캐릭터 획득
    - 스트릭 변경권 - 랜덤 팔레트 변경
      - 등급에 따라 종이 폭죽 터지는 기능
    - ... 추가 예정
  - 캐릭터 판매 - 캐릭터 가치에 따라 포인트 획득

- 설정

  - 진동 on/off 기능 (모바일 지원)
  - 다크 모드
  - 로그아웃

- 추가 기능
  - 메인 캐릭터 혼잣말 & 클릭시 말하기 기능
  - 방문자 모드 추가 (기능 제한 후 로그인 게이트 삭제)
    - 크롤링 및 애드센스를 위함 & 로그인 없이 사이트 구경

### 📱 PWA - 모바일 흉내

- 모바일 안전영역(safe area) 고려
  - `tailwindcss-safe-area` 플러그인 사용
- 스크롤바 감추기
  - `tailwind-scrollbar-hide` 플러그인 사용
- 모바일 앱종료 구현

  - 첫 접속 시 `dummy history` 생성
  - 라우터 이동 간 `history` 저장 X (해도 상관없는데 앱 특성상 탭 이동이 잦아 불필요한 히스토리가 많이쌓임)
  - `ref`로 `backButtonPressed` 생성
  - 로직 (`use-close-app-handler.ts`)
    - 1. 뒤로가기 혹은 이전 키 누를 시 `dummy history` 제거(못막음) 후 즉시 `dummy history` 추가
    - 2. `backButtonPressed` 상태에 따라 분기
      - false: `backButtonPressed`를 true로 변경하고 false로 변경하는 로직을 `setTimeout`으로 이벤트큐에 담고 `toast UI` 표시 (한번더 누르면 종료됩니다.)
        - `setTimeout`은 `dealy`초 후 실행, `toast`는 `delay`초 후 사라짐
      - true: `window.history.go(-(window.history.length + 2))`로 앱 종료
  - +브라우저 동작 (크롬 기준)
    - 자바스크립트로 history를 조작 한 후 사용자의 실제 상호작용(터치 등)이 없으면 pop 동작 시 현재 도메인의 히스토리가 몇개든 전체(같은 도메인)가 pop됨
      (이로인해 뒤로가기 후 상호작용 없이 5초 뒤 뒤로가기를 누르면 앱 종료 - 못막음)
    - history.go(-4)를 해도 중간에 다른 도메인이 존재하면 해당 도메인 까지만 이동
    - 이로인해 oauth 처리 시 리다이렉트 -> 팝업 방식으로 변경

- [x] 뽀모도로 타이머 웹 푸시(FCM)
  - 모바일에선 화면이 자동으로 꺼지기 때문에 백그라운드로 돌아가게 되어 뽀모도로 모드에서 끝날때를 알려야함 (네이티브 앱이 아니라 잠금 모드 불가)
  - 웹 푸시를 허용하지 않으면 뽀모도로 모드를 사용하지 못하도록 막기
  - 뽀모도로 푸시알림 예약 api 작업
    - 백그라운드로 가면 남은시간 계산 후 푸시알림 예약 api 발송 (message queue 예약)
    - 앱 다시 활성화 시 푸시알림 예약 취소

### ⚡️ 성능 개선

- 같이 공부하기에서 타이머 증가 event 줄이기 (최대 8명 + 내 타이머 까지 동일한 이벤트 9개가 리스너에 등록됨)
  - 내 타이머를 글로벌로 설정
  - 그룹 입장 시 유저 첫 렌더링에서 기준시간 계산
    - 렌더링 된 시간 - 글로벌 duration = 내가 그룹에 입장한 시간
    - 내가 그룹에 입장한 시간 - 렌더링할 유저의 입장시간 = 내가 입장한 시간과 해당 유저의 차이
      (먼저 들어온 유저면 플러스, 이후에 들어온 유저면 마이너스)
    - 내가 입장한 시간과 해당 유저의 차이 + 글로벌 duration = 각 유저의 공부중인 시간
- 타이머 이벤트의 상태변화에 의해 매초 발생하는 컴포넌트 리렌더링 줄이기 (타이머 모달에 영향받는 컴포넌트만)
  - React.memo로 리렌더링 전파 줄이기
  - zustand에서 객체로 관리하던 상태를 펼쳐서 값으로 관리 (매초 업데이트되는 duration과 다른 값들을 같은 참조로 묶지 않기)
  - zustand 사용시 구조분해 할당 대신 필요한 데이터만 조회 - useTimerStateStore(state => state.timerType)
  - 값을 실제로 사용하는 컴포넌트를 분리하여 해당 컴포넌트만 리렌더링 (TimerDisplay, TimerPauseButton 등등)

### ⚙️ 환경

- 배포 - `Vercel`
- Core
  - `react v18.2.x`
  - `vite v5.0.x`
  - `vite-plugin-pwa v0.17.x`
- 라우팅
  - `react-router-dom v6.22.x`
- 상태 관리
  - `react-query v5.17.x`
  - `zustand v4.5.x`
- 스타일링
  - `tailwind v3.4.x`
  - `shadcn/ui`
- 통신
  - `axios v1.6.x`
  - `socket.io-client v4.7.x`
- Validation
  - `zod v3.22.x`

### 👨‍🌾 Task

- [x] 타이머 백그라운드 상황 처리
  - startTime을 기록하여 앱이 백그라운드로 갈때 타이머를 멈추고 앱이 다시 활성화 되면 startTime 기준으로 시간 업데이트
- [x] 타이머 정확도 높히기
  - 타이머 시작 시 시간(`startTime`)을 기록하고 초 업데이트 시 `startTime - Date.now()`로 정확성 높이기
- [x] 앱이 백그라운드 상태면 vibration API와 타이머 종료 api를 보낼 수 없음
  - 따라서 앱에 다시 들어왔을때 진동과 종료 api를 처리해야함
  - 스터디 레코드에 targetTime을 기록하고 endTime에 Date대신 초단위로 기록하여 최대 targetTime만 기록되도록 로직수정
    (Math.min(targetTime, (Date.now() - record.created_at.getTime()) / 1000))
- [x] 구글 간편로그인 기능
- [x] 카카오 간편로그인 기능
- [x] 네이버 간편로그인 기능
- [x] Color Theme 작업 (가시성 향상, 브랜드 색 결정)
- [x] 타이머 중단 Dialog 디자인 수정
- [x] 로그아웃 확인 Dialog 작업
- [x] 계정 삭제 기능
- [x] 프로필 사진 없을 때 기본 이미지 적용
- [x] 안쓰는 디펜던시 정리
- [x] 잔디 위에 요일 표시
- [x] oauth 로그인 페이지 redirect -> popup
- [x] 일반 타이머 모드 추가
- [x] 뽀모도로 모드 웹 푸시 알림 추가(fcm)

### 🚨 TroubleShooting

#### 1. Shadcn/ui - Toast + reactQuery 사용시 충돌

sonner 라이브러리로 교체함

[https://stackoverflow.com/questions/77923557]("https://stackoverflow.com/questions/77923557/why-does-my-shadcn-ui-datatable-not-reload-on-invalidating-query")

#### 2. OAuth 간편로그인 시 리다이렉트로 구현하여 모바일 종료 동작 X

##### 문제

브라우저 정책이 많이 강화되어서 window.close()도 안되고 여러 꼼수들이 전부 막혔음

pwa앱을 종료하기 위해서는 최상위 history에서 pop이 수행되어야함

간편로그인 페이지를 redirect uri 하여 처리하니 중간에 외부 history가 낑기는 문제 발생

##### 해결책

- 간편 로그인 페이지 이동 시 `redirect` 동작을 `popup` 방식으로 변경하여 외부 히스토리 방지하기

  - 기존 방식 (히스토리에 외부 oauth login 히스토리가 쌓임)
    - 로그인 클릭 시 oauth login 페이지로 redirect
    - 로그인 완료 후 /auth/login/callback/... 으로 redirect
    - 해당 콜백 페이지에서 로그인 처리 후 메인으로 리다이렉팅
  - 변경 후

    - 간편 로그인 버튼 컴포넌트 클릭 시 popup 오픈
    - 로그인 완료 후 /auth/login/callback/... 으로 redirect
    - 해당 콜백 페이지에서 window.opener에 type과 code 를 postMessage로 전송 후 팝업 닫기 (ex. {type: "google-login", code})
    - 간편 로그인 버튼 컴포넌트의 useEffect에서 로그인을 처리하는 로직을 message 이벤트로 등록

    - ++ COOP 문제로 인해 @react-oauth/google 제거 후 팝업 직접 구현
