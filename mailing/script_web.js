const { chromium } = require('playwright');
const fs = require('fs');
const loginPage = 'https://faberlic.com/ru/ru/login';
const reportPage = 'https://faberlic.com/rssreports/otchet.php?linkreport=/ReportServer/Pages/ReportViewer.aspx?%2fRP_distributor%2fReportMLM2MC&rs:Command=Render&rc:Stylesheet=htmlviewer&nnumber=737127362&period=30000000521&nullsum=0&ownstructure=1&hidezombnull=0&lang=RU';

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
  await page.waitForSelector('input[name*="ReportViewerControl"][name$="ctl0"]', { state: 'attached' });
  
  // Ждем, пока SSRS "отлагает" внутри
  await page.waitForFunction(() => {
    const v = window.$find("ReportViewerControl");
    return v && !v.get_isLoading();
  });
  
  // Если нужно вызвать экспорт через URL (самый стабильный метод для Playwright)
  // Вместо кликов по меню просто переходим по прямой ссылке:
  const currentUrl = page.url();
  const exportUrl = currentUrl.replace('Reserved.ReportViewerWebControl.axd', 'ReportServer') + '&rs:Format=XML';
  
  // Мы запускаем ожидание ПЕРЕД тем, как вызвать команду экспорта
  const downloadPromise = page.waitForEvent('download');
  // Переходим по ссылке экспорта
  await page.goto(exportUrl);
  // await page.evaluate(() => {
  //   // Вызываем встроенную функцию ReportViewer
  //   $find('ReportViewerControl').exportReport('XML');
  // });

  const download = await downloadPromise;

  // 4. Сохранение скачанного файла
  const path = './ReportMLM2MC.xml';
  await download.saveAs(path);
  
  console.log(`Файл успешно скачан и сохранен в: ${path}`);

  await browser.close();
})();
