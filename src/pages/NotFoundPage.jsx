import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={containerStyle}>
      <h1 className="typo-h2">404</h1>
      <p className="typo-body1">페이지를 찾을 수 없습니다.</p>
      <Link to="/" style={linkStyle}>
        홈으로 돌아가기
      </Link>
    </div>
  );
}

const containerStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  padding: 24,
};

const linkStyle = {
  color: 'var(--color-primary)',
  textDecoration: 'underline',
};
