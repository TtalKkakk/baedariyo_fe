let daumPostcodePromise;

export function loadDaumPostcode() {
  if (window.daum?.Postcode) {
    return Promise.resolve(window.daum);
  }

  if (daumPostcodePromise) {
    return daumPostcodePromise;
  }

  daumPostcodePromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src =
      'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => resolve(window.daum);
    script.onerror = () => {
      daumPostcodePromise = undefined;
      reject(new Error('Daum Postcode SDK 로드 실패'));
    };
    document.head.appendChild(script);
  });

  return daumPostcodePromise;
}
