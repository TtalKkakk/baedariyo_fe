import { useEffect, useRef, useState } from 'react';
import { loadKakaoMapSdk } from '@/shared/lib/loadKakaoMap';

export default function KakaoMap() {
  const mapElRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    loadKakaoMapSdk()
      .then((kakao) => {
        if (!isMounted || !mapElRef.current) {
          return;
        }

        const center = new kakao.maps.LatLng(37.5665, 126.978); // 서울 시청
        const map = new kakao.maps.Map(mapElRef.current, {
          center,
          level: 3,
        });

        const marker = new kakao.maps.Marker({ position: center });
        marker.setMap(map);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setErrorMessage(err.message || '지도를 불러오지 못했습니다.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapElRef} className="w-full h-full" />
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
}
