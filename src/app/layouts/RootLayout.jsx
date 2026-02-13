import { Outlet } from 'react-router-dom';

/**
 * RootLayout - 모바일 프레임 공통 레이아웃
 */
export default function RootLayout() {
  return (
    <div style={pageStyle}>
      <div style={appFrameStyle}>
        <Outlet />
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--color-semantic-background-normal-alternative)',
  padding: 24,
};

const appFrameStyle = {
  width: 390,
  height: 844,
  background: 'var(--color-bg, #ffffff)',
  borderRadius: 24,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid var(--color-semantic-line-solid-neutral)',
  boxShadow: 'var(--style-semantic-shadow-emphasize)',
};
