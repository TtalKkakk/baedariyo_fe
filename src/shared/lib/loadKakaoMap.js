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

    const timeout = setTimeout(() => {
      kakaoSdkPromise = undefined;
      reject(
        new Error(
          `카카오맵 로드 실패. 카카오 개발자 콘솔 → 내 애플리케이션 → 플랫폼 → Web에 현재 도메인(${window.location.origin})을 등록해주세요.`
        )
      );
    }, 8000);

    script.onload = () =>
      window.kakao.maps.load(() => {
        clearTimeout(timeout);
        resolve(window.kakao);
      });
    script.onerror = () => {
      clearTimeout(timeout);
      kakaoSdkPromise = undefined;
      reject(new Error('카카오맵 SDK 로드 실패'));
    };

    document.head.appendChild(script);
  });

  return kakaoSdkPromise;
}
