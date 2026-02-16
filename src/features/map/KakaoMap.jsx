import { useEffect, useRef } from 'react';
import { loadKakaoMapSdk } from '@/shared/lib/loadKakaoMap';

export default function KakaoMap() {
  const mapElRef = useRef(null);

  useEffect(() => {
    let map;

    loadKakaoMapSdk()
      .then((kakao) => {
        const center = new kakao.maps.LatLng(37.5665, 126.978); // 서울 시청
        map = new kakao.maps.Map(mapElRef.current, {
          center,
          level: 3,
        });

        const marker = new kakao.maps.Marker({ position: center });
        marker.setMap(map);
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });

    return () => {
      map = null;
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapElRef} className="w-full h-full" />
    </div>
  );
}
