let kakaoSdkPromise;

export function loadKakaoMapSdk() {
  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }

  if (kakaoSdkPromise) {
    return kakaoSdkPromise;
  }

  kakaoSdkPromise = new Promise((resolve, reject) => {
    const appKey = import.meta.env.VITE_KAKAO_APP_KEY;
    if (!appKey) {
      reject(new Error('VITE_KAKAO_APP_KEY가 .env에 없습니다.'));
      kakaoSdkPromise = undefined;
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;

    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao));
    script.onerror = () => {
      kakaoSdkPromise = undefined;
      reject(new Error('카카오맵 SDK 로드 실패'));
    };

    document.head.appendChild(script);
  });

  return kakaoSdkPromise;
}
