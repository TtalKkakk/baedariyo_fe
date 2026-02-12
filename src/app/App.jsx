import Header from '../components/Header';
import KakaoMap from '../components/KakaoMap';

export default function App() {
  return (
    <div style={pageStyle}>
      <div style={appFrameStyle}>
        <Header />
        <main style={mainStyle}>
          <KakaoMap />
        </main>
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

const mainStyle = {
  flex: 1,
  minHeight: 0,
};
