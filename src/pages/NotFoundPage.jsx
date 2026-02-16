import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="layout-center">
      <h1 className="text-h2">404</h1>
      <p className="text-body1">페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="text-primary underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
