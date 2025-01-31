const KAKAO_MAP_APP_KEY = "YOUR_KAKAO_JAVASCRIPT_API_수기입력"; // ✅ 한 곳에서만 설정

let isKakaoLoading = false; // ✅ 중복 방지용 변수
let kakaoPromise = null;

export const loadKakaoMap = () => {
  if (window.kakao && window.kakao.maps) {
    console.log("✅ 카카오 맵 API가 이미 로드됨");
    return Promise.resolve(window.kakao);
  }

  if (isKakaoLoading) {
    console.log("🚀 카카오 맵 API 로드 중... (대기 중)");
    return kakaoPromise;
  }

  console.log("🚀 카카오 맵 API 로드 시작...");
  isKakaoLoading = true;
  kakaoPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("✅ 카카오 맵 API 로드 완료");
        isKakaoLoading = false;
        resolve(window.kakao);
      });
    };
    script.onerror = () => {
      console.error("❌ 카카오 맵 API 로드 실패");
      isKakaoLoading = false;
      reject(new Error("카카오 맵 API 로드 실패"));
    };

    document.head.appendChild(script);
  });

  return kakaoPromise;
};

