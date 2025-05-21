let videoAlarmSound = new Audio(
  "https://t1.daumcdn.net/cfile/tistory/991B26505CF6B23D03"
);
videoAlarmSound.volume = 0.5;
let tutorName = "남동현";
let endWorkHour = 18;

let checkInterval = null;

// 상태 초기화
chrome.storage.local.get("isAlarmActive", (result) => {
  if (result.isAlarmActive) {
    startAlarm();
  }
});

function checkVideoCount() {
  let videos = document.querySelector(
    '#play-ui-layout [class^="VideosRightView_right_view_wrapper"] > div'
  );
  if (!videos) return;

  let videoCount = Array.from(videos.children).filter(
    (video) => video.tagName === "DIV"
  ).length;
  if (videoCount > 1) {
    if (!window.alarmed) {
      videoAlarmSound.play();
      setTimeout(stopVideoCheckAlarmSound, 1000);
    }
    window.alarmed = true;
    const names = videos.querySelectorAll('span[class^="PlayerVideo_text"]');

    Array.from(names)
      .filter(
        (name) =>
          !name.textContent.includes("의 화면") &&
          !tutorName.split(",").includes(name.textContent)
      )
      .forEach((name) => {
        setOrUpdateZepVisitNames(name.textContent);
      });
  } else {
    window.alarmed = false;
  }
}

function getTodayVisitCount() {
  const key = "ZepVisitNames";
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, val] = cookie.split("=");
    acc[decodeURIComponent(key)] = decodeURIComponent(val);
    return acc;
  }, {});
  return cookies[key]?.split(",").length || 0;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTodayVisitCount") {
    try {
      const count = getTodayVisitCount();
      sendResponse(count);
    } catch (error) {
      console.error("Error in getTodayVisitCount:", error);
      sendResponse(undefined);
    }
  }
  return true;
});

function setOrUpdateZepVisitNames(value) {
  // 쿠키 목록 확인
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, val] = cookie.split("=");
    acc[decodeURIComponent(key)] = decodeURIComponent(val);
    return acc;
  }, {});

  const key = "ZepVisitNames";
  let newValue;

  // 쿠키 존재 여부 확인
  if (cookies[key]) {
    // 기존 쿠키 값에 새로운 값을 추가 (중복 방지)
    const existingValues = cookies[key].split(",");
    if (!existingValues.includes(value)) {
      newValue = Array.from(new Set([...existingValues, value])).join(",");
    } else {
      newValue = cookies[key]
        .split(",")
        .filter(
          (name) =>
            !name.includes("의 화면") && !tutorName.split(",").includes(name)
        )
        .join(",");
    }
  } else {
    newValue = value;
  }

  // 쿠키 설정
  setCookie(key, newValue, {
    expires: getEndOfDayString(),
    path: "/",
    secure: true,
    sameSite: "Strict",
  });
}

function setCookie(name, value, options = {}) {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires) {
    const expiresDate = new Date(options.expires);
    cookieString += `; expires=${expiresDate.toUTCString()}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.secure) {
    cookieString += `; secure`;
  }
  document.cookie = cookieString;
}

function getEndOfDayString() {
  const parsedHour = endWorkHour;
  if (isNaN(parsedHour) || parsedHour < 0 || parsedHour > 23) {
    throw new RangeError(
      "Invalid time value: endWorkHour must be a number between 0 and 23."
    );
  }

  const today = new Date();
  const currentHour = today.getHours();

  if (parsedHour <= currentHour) {
    today.setDate(today.getDate() + 1); // 내일로 이동
  }

  today.setHours(parsedHour, 0, 0, 0); // endWorkHour로 시간 설정
  return today.toISOString();
}

function stopVideoCheckAlarmSound() {
  videoAlarmSound.pause();
  videoAlarmSound.currentTime = 0;
}

function startAlarm() {
  if (!checkInterval) {
    checkInterval = setInterval(checkVideoCount, 1000);
  }
}

function stopAlarm() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  stopVideoCheckAlarmSound();
}

// 메시지 리스너: popup에서 온 메시지를 처리
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleAlarm") {
    if (message.isActive) {
      startAlarm();
    } else {
      stopAlarm();
    }
    sendResponse({ status: "success" });
  }
});

// 저장된 볼륨 값을 로드
chrome.storage.local.get("alarmVolume", (result) => {
  if (result.alarmVolume !== undefined) {
    videoAlarmSound.volume = result.alarmVolume;
  }
});

// 메시지 리스너: popup에서 메시지를 받아 처리
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleAlarm") {
    if (message.isActive) {
      startAlarm();
    } else {
      stopAlarm();
    }
    sendResponse({ status: "success" });
  } else if (message.action === "setVolume") {
    videoAlarmSound.volume = message.volume; // 볼륨 값 업데이트
    sendResponse({ status: "volume updated" });
  } else if (message.action == "setTutorName") {
    tutorName = message.tutorName;
    sendResponse({ status: "tutorName updated" });
  } else if (message.action == "setEndTime") {
    endWorkHour = message.endWorkHour;
    sendResponse({ status: "endWorkHour updated" });
  }
});

console.log("Zep 도어벨 & 방문자수 체커 로드됨");
