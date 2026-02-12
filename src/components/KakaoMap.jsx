import { useEffect, useRef } from 'react';
import { loadKakaoMapSdk } from '../lib/loadKakaoMap';

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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={mapElRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
