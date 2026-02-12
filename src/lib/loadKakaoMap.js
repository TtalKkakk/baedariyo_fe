export function loadKakaoMapSdk() {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve(window.kakao);
      return;
    }

    const appKey = import.meta.env.VITE_KAKAO_APP_KEY;
    if (!appKey) {
      reject(new Error('VITE_KAKAO_APP_KEY가 .env에 없습니다.'));
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;

    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao));
    script.onerror = () => reject(new Error('카카오맵 SDK 로드 실패'));

    document.head.appendChild(script);
  });
}
