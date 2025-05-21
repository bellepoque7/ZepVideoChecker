document.addEventListener("DOMContentLoaded", () => {
  const toggleAlarm = document.getElementById("toggle-alarm");
  const volumeSlider = document.getElementById("volume-slider");
  const tutorName = document.getElementById("tutor-name");
  const endTime = document.getElementById("end-time");
  const todayVisitCount = document.getElementById("today-visit-count");

  // 저장된 상태를 로드하여 초기화
  chrome.storage.local.get(
    ["isAlarmActive", "alarmVolume", "tutorName", "endTime"],
    (result) => {
      if (result.isAlarmActive) {
        toggleAlarm.classList.add("active");
      }
      if (result.alarmVolume !== undefined) {
        volumeSlider.value = result.alarmVolume;
      }
      if (result.tutorName !== undefined) {
        tutorName.value = result.tutorName;
      }
      if (result.endTime !== undefined) {
        endTime.value = result.endTime;
      }
    }
  );

  // 토글 상태 변경
  toggleAlarm.addEventListener("click", () => {
    const isActive = !toggleAlarm.classList.contains("active");
    toggleAlarm.classList.toggle("active", isActive);

    // 상태 저장
    chrome.storage.local.set({ isAlarmActive: isActive });

    // content script에 상태 전달
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggleAlarm",
          isActive: isActive,
        });
      }
    });
  });

  // 볼륨 값 변경
  volumeSlider.addEventListener("input", () => {
    const volume = parseFloat(volumeSlider.value);

    // 상태 저장
    chrome.storage.local.set({ alarmVolume: volume });

    // content script에 볼륨 값 전달
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "setVolume",
          volume: volume,
        });
      }
    });
  });

  tutorName.addEventListener("change", (e) => {
    const name = e.target.value;
    chrome.storage.local.set({ tutorName: name });

    cosnole.log(name);

    // content script에 볼륨 값 전달
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "setTutorName",
          tutorName: name,
        });
      }
    });
  });

  endTime.addEventListener("change", (e) => {
    const time = e.target.value;
    chrome.storage.local.set({ endTime: time });

    // content script에 볼륨 값 전달
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "setEndTime",
          endWorkHour: time,
        });
      }
    });
  });

  // contnet.js 의 getTodayVisitCount 메서드를 호출한 응답값을 todayVisitCount 에 표시
  // 팝업을 오픈할 때 마다 갱신
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getTodayVisitCount" },
        (response) => {
          todayVisitCount.textContent =
            response != undefined ? response : "오류 발생";
        }
      );
    }
  });
});
