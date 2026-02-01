const { chromium } = require('playwright');
const fs = require('fs');

const loginPage = 'https://faberlic.com/ru/ru/login';
const nnumber = process.env.USER;
const period = process.env.PERIOD;
const nullsum = process.env.NULLSUM;
const ownstructure = process.env.OWNSTRUCTURE;
const report = process.env.REPORT;
const reportMLM2MC = `https://faberlic.com/rssreports/otchet.php?linkreport=/ReportServer/Pages/ReportViewer.aspx?%2fRP_distributor%2fReportMLM2MC&rs:Command=Render&rc:Stylesheet=htmlviewer&nnumber=${nnumber}&period=${period}&nullsum=${nullsum}&ownstructure=${ownstructure}&hidezombnull=0&lang=RU`;
const consultantTreeMLM = `https://faberlic.com/rssreports/otchet.php?linkreport=/ReportServer/Pages/ReportViewer.aspx?%2fRPP%2fConsultantTreeMLM&rs:Command=Render&rc:Stylesheet=htmlviewer&cons=1001494180387&period=${period}&cur=445&ownstructure=${ownstructure}&withzero=${nullsum}&lang=RU`;
const reportPage = (report === 'ReportMLM2MC') ? reportMLM2MC : consultantTreeMLM;

console.log(`Сформирован URL ${report}-отчета: ${reportPage}`);
  
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
  
  // 2. Переход на страницу с отчетом
  await page.goto(reportPage);

  // 3. Ожидание события загрузки и вызов JS функции
  // Ждем первичной загрузки интерфейса
  await page.waitForSelector('div[id*="ReportViewerControl"]', { state: 'attached' });
  console.log(`ReportViewerControl найден`);
  
  // Снимает ограничение на навигацию и действия (0 = бесконечно)
  page.setDefaultNavigationTimeout(0); 
  page.setDefaultTimeout(0); 
  // Ждем, пока SSRS "отлагает" внутри
  // 1. Ждем, пока исчезнет индикатор "Loading..." (если он есть в DOM)
  await page.waitForSelector('#ReportViewerControl_AsyncWait_Wait', { state: 'hidden', timeout: 120000 }).catch(() => {});
  // 2. Ждем, пока в области отчета появится реальный контент (таблица или ячейка)
  await page.waitForSelector('div[id*="VisibleReportContent"]', { timeout: 120000 });
  // 3. И только теперь проверяем статус через waitForFunction
  await page.waitForFunction(() => {
      const v = window.$find("ReportViewerControl");
      // Проверяем, что отчет не грузится И область контента не пуста
      return v && !v.get_isLoading() && v.get_reportAreaContentType() !== "None";
  }, { timeout: 60000 });
  
  // Мы запускаем ожидание ПЕРЕД тем, как вызвать команду экспорта
  const downloadPromise = page.waitForEvent('download');
  await page.evaluate(() => {
    // Вызываем встроенную функцию ReportViewer
    $find('ReportViewerControl').exportReport('XML');
  });

  const download = await downloadPromise;

  // 4. Сохранение скачанного файла
  const path = `${report}.xml`;
  await download.saveAs(path);
  
  console.log(`Файл успешно скачан и сохранен в: ${path}`);

  await browser.close();
})();
