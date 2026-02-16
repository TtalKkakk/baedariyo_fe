import { useEffect, useRef, useState } from 'react';
import { loadKakaoMapSdk } from '../lib/loadKakaoMap';

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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={mapElRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      {errorMessage && <p style={errorTextStyle}>{errorMessage}</p>}
    </div>
  );
}

const errorTextStyle = {
  position: 'absolute',
  left: 16,
  right: 16,
  bottom: 16,
  padding: '10px 12px',
  margin: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(220, 38, 38, 0.95)',
  color: '#fff',
  fontSize: 13,
  lineHeight: 1.4,
};
