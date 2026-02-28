# Backend Run Guide (Local)

`baedariyo_fe`에서 API 연동 테스트할 때 사용하는 백엔드 실행 가이드입니다.

## 1) 전체 구조

- 주문/가게/리뷰/인증 API: `baedariyo_be`
- 결제 PG 서버(별도): `payment`
- 프론트 기본 API 주소: `http://localhost:8080` (`VITE_API_BASE_URL` 미설정 시)

프론트 화면 API 연동만 확인하려면 우선 `baedariyo_be`만 실행해도 됩니다.

## 2) 공통 준비사항

- Java 17
- (권장) Docker Desktop
- Node/NPM은 프론트 실행 시 필요

## 3) `baedariyo_be` 실행

### 3-1. JWT 시크릿 설정 파일 생성

`/Users/minseokjeong/workspace/baedariyo_be/src/main/resources/application-secret.yml`

```yaml
jwt:
  secret-key: change-this-to-a-long-secret-key
  access-token-validity-seconds: 3600
  refresh-token-validity-seconds: 1209600
```

`application.yml`에서 위 값을 참조하므로 파일이 없으면 서버가 부팅되지 않습니다.

### 3-2. 서버 실행

```bash
cd /Users/minseokjeong/workspace/baedariyo_be
./gradlew bootRun
```

기본 포트는 `8080`입니다.

## 4) `payment` 서버 실행

`payment` 프로젝트는 `application.yml`이 Git에 포함되지 않으므로 로컬에서 직접 만들어야 합니다.

### 4-1. MySQL/Redis 준비 (예시)

```bash
docker run -d --name payment-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=payment \
  -p 3306:3306 mysql:8.0

docker run -d --name payment-redis -p 6379:6379 redis:7
```

### 4-2. 로컬 설정 파일 생성

`/Users/minseokjeong/workspace/payment/src/main/resources/application.yml`

```yaml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/payment?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        format_sql: true
  data:
    redis:
      host: localhost
      port: 6379

app:
  admin:
    username: admin
    password: change-me
```

`app.admin.username`, `app.admin.password`는 코드에서 필수로 주입됩니다.

### 4-3. 서버 실행

```bash
cd /Users/minseokjeong/workspace/payment
./gradlew bootRun
```

포트 충돌을 피하기 위해 `8081` 사용을 권장합니다.

## 5) 프론트 연결

`baedariyo_fe/.env`에서 API 주소를 맞춥니다.

```env
VITE_API_BASE_URL=http://localhost:8080
```

프론트 실행:

```bash
cd /Users/minseokjeong/workspace/baedariyo_fe
npm run dev
```

## 6) 확인 체크리스트

- `baedariyo_be` 부팅 로그에 에러가 없는지 확인
- 프론트에서 로그인/가게 상세/리뷰/주문/결제 페이지 진입 확인
- 백엔드 미연결 시에는 프론트 mock fallback 동작 (현재 구현됨)

## 7) 자주 발생하는 문제

- `Port 8080 already in use`: 기존 프로세스 종료 후 재실행
- `Could not resolve placeholder ... jwt...`: `application-secret.yml` 누락
- `Failed to configure a DataSource` (`payment`): `application.yml` datasource 설정 누락
- `Access denied for user` (`payment`): MySQL 계정/비밀번호 불일치
