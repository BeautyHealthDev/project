const { chromium } = require('playwright');
const fs = require('fs');
const loginPage = 'https://faberlic.com/ru/ru/login';
const reportPage = 'https://faberlic.com/rssreports/otchet.php?linkreport=/ReportServer/Pages/ReportViewer.aspx?%2fRP_distributor%2fReportMLM2MC&rs:Command=Render&rc:Stylesheet=htmlviewer&nnumber=737127362&period=30000000521&nullsum=1&ownstructure=0&hidezombnull=0&lang=RU';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Авторизация
  await page.goto(loginPage);
  await page.fill('#login', process.env.USER);
  await page.fill('#password', process.env.PASS);
  await page.click('button[dt="login_signInBtn"]');
  await page.waitForNavigation();

  // 2. Переход на страницу с отчетом
  await page.goto(reportPage);

  // 3. Ожидание события загрузки и вызов JS функции
  // Мы запускаем ожидание ПЕРЕД тем, как вызвать команду экспорта
  const downloadPromise = page.waitForEvent('download');
  
  await page.evaluate(() => {
    // Вызываем встроенную функцию ReportViewer
    $find('ReportViewerControl').exportReport('XML');
  });

  const download = await downloadPromise;

  // 4. Сохранение скачанного файла
  const path = './ReportMLM2MC.xml';
  await download.saveAs(path);
  
  console.log(`Файл успешно скачан и сохранен в: ${path}`);

  await browser.close();
})();
