const { chromium } = require('playwright');
const fs = require('fs');
const loginPage = 'https://faberlic.com/ru/ru/login';
const reportPage = 'https://faberlic.com/rssreports/otchet.php?linkreport=/ReportServer/Pages/ReportViewer.aspx?%2fRP_distributor%2fReportMLM2MC&rs:Format=XML&nnumber=737127362&period=30000000521&nullsum=0&ownstructure=1&hidezombnull=0&lang=RU';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Авторизация
  await page.goto(loginPage);
  await page.fill('#login', process.env.USER);
  await page.fill('#password', process.env.PASS);
  await page.click('button[dt="login_signInBtn"]');
  // Ждем завершения навигации после клика
  await page.waitForNavigation();
  console.log(`Страница ${loginPage} успешно загружена`);

  // 2. Переход на страницу с XML
  // Браузер сохранит сессию (cookies), поэтому повторный логин не потребуется
  const response = await page.goto(reportPage, { timeout: 120000 });
  console.log(`Страница ${reportPage} успешно загружена`);

  // 3. Получаем содержимое XML и сохраняем в файл
  const path = './ReportMLM2MC.xml';
  const xmlContent = await response.text();
  fs.writeFileSync(path, xmlContent);
  console.log(`XML-файл с отчетом успешно скачан и сохранен в: ${path}`);

  await browser.close();
})();
