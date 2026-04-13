// Demo smoke test — 주요 페이지 순회하며 빈 화면/콘솔 에러 탐지
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.SMOKE_BASE ?? 'http://127.0.0.1:4173/baedariyo_fe';
const OUT_DIR = path.resolve('smoke-out');

// "빈 상태"로 판단할 문구들 (UI에 노출되면 리포트)
const EMPTY_SIGNALS = [
  '도착한 알림이 없습니다',
  '등록된 주소가 없습니다',
  '등록된 결제수단이 없습니다',
  '결제수단이 없습니다',
  '주문 내역이 없습니다',
  '리뷰가 없습니다',
  '쿠폰이 없습니다',
  '내역이 없습니다',
  '검색 결과가 없습니다',
  '데이터가 없습니다',
  'No results',
];

const PUBLIC_PAGES = [
  { name: 'home', path: '/' },
  { name: 'search', path: '/search' },
  { name: 'search-result', path: '/search/result?q=%EC%B9%98%ED%82%A8' },
  { name: 'store-detail-chicken', path: '/stores/bb000001-0000-4000-8000-000000000001' },
  { name: 'store-detail-maratang', path: '/stores/aa000001-0000-4000-8000-000000000001' },
  { name: 'login', path: '/login' },
  { name: 'signup-role', path: '/signup' },
  { name: 'signup-user', path: '/signup/user' },
  { name: 'category-chinese', path: '/category/CHINESE' },
];

const AUTHED_PAGES = [
  { name: 'mypage', path: '/mypage' },
  { name: 'profile', path: '/mypage/profile' },
  { name: 'addresses', path: '/mypage/addresses' },
  { name: 'payment-methods', path: '/mypage/payment-methods' },
  { name: 'payment-methods-register', path: '/mypage/payment-methods/register' },
  { name: 'my-payments', path: '/mypage/payment' },
  { name: 'coupons', path: '/mypage/coupons' },
  { name: 'my-reviews', path: '/mypage/reviews' },
  { name: 'notifications', path: '/notifications' },
  { name: 'notification-settings', path: '/mypage/notification-settings' },
  { name: 'orders', path: '/orders' },
  { name: 'cart', path: '/cart' },
  { name: 'terms', path: '/mypage/terms' },
  { name: 'support', path: '/mypage/support' },
  { name: 'inquiries', path: '/mypage/inquiries' },
  { name: 'security', path: '/mypage/security' },
  { name: 'address-search', path: '/address/search' },
  { name: 'address-setting', path: '/mypage/addresses' },
];

async function visit(page, entry) {
  const logs = [];
  const reqFailures = [];

  const onConsole = (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      logs.push(`[${msg.type()}] ${msg.text()}`);
    }
  };
  const onPageError = (err) => logs.push(`[pageerror] ${err.message}`);
  const onReqFailed = (req) => {
    // 외부 이미지(unsplash) 실패는 무시
    if (req.url().includes('unsplash.com')) return;
    reqFailures.push(`${req.method()} ${req.url()} :: ${req.failure()?.errorText}`);
  };

  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  page.on('requestfailed', onReqFailed);

  const url = BASE + entry.path;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  } catch (err) {
    logs.push(`[goto-error] ${err.message}`);
  }
  // 클라이언트 라우팅/렌더링 여유
  await page.waitForTimeout(400);

  const bodyText = (await page.locator('body').innerText().catch(() => '')).trim();
  const rootHtmlLen = (await page.locator('#root').innerHTML().catch(() => '')).length;
  const finalUrl = page.url();

  const emptySignals = EMPTY_SIGNALS.filter((sig) => bodyText.includes(sig));
  const looksBlank = rootHtmlLen < 200 || bodyText.length < 20;

  page.off('console', onConsole);
  page.off('pageerror', onPageError);
  page.off('requestfailed', onReqFailed);

  // 스크린샷
  const shotPath = path.join(OUT_DIR, `${entry.name}.png`);
  await page.screenshot({ path: shotPath, fullPage: true }).catch(() => {});

  return {
    name: entry.name,
    path: entry.path,
    finalUrl,
    looksBlank,
    rootHtmlLen,
    bodyTextLen: bodyText.length,
    emptySignals,
    logs,
    reqFailures,
    screenshot: path.relative('.', shotPath),
  };
}

async function login(page) {
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'demo@baedariyo.test');
  await page.fill('input[type="password"]', 'demo1234');
  await page.click('button[type="submit"]');
  // navigate to /mypage after login
  await page.waitForURL('**/mypage', { timeout: 10000 }).catch(() => {});
  const token = await page.evaluate(() => localStorage.getItem('accessToken'));
  return !!token;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 400, height: 900 } });
  const page = await ctx.newPage();

  const report = { public: [], authed: [], loginOk: false };

  for (const entry of PUBLIC_PAGES) {
    const r = await visit(page, entry);
    report.public.push(r);
    console.log(`[public] ${entry.name} len=${r.bodyTextLen} empty=${r.emptySignals.length} errs=${r.logs.length}`);
  }

  report.loginOk = await login(page);
  console.log(`[login] tokenIssued=${report.loginOk}`);

  for (const entry of AUTHED_PAGES) {
    const r = await visit(page, entry);
    report.authed.push(r);
    console.log(`[authed] ${entry.name} len=${r.bodyTextLen} empty=${r.emptySignals.length} errs=${r.logs.length}`);
  }

  await writeFile(path.join(OUT_DIR, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`\nReport: ${path.join(OUT_DIR, 'report.json')}`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
