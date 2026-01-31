const { chromium } = require('playwright');
const fs = require('fs');
const loginPage = 'https://faberlic.com/ru/ru/login';
// const nnumber = process.env.USER;
const period = process.env.PERIOD;
const nullsum = process.env.NULLSUM;
const ownstructure = process.env.OWNSTRUCTURE;
// const hidezombnull = process.env.HIDEZOMBNULL;
// const reportPage = `https://faberlic.com/rssreports/otchet.php?linkreport=/ReportServer/Pages/ReportViewer.aspx?%2fRP_distributor%2fReportMLM2MC&rs:Command=Render&rc:Stylesheet=htmlviewer&nnumber=${nnumber}&period=${period}&nullsum=${nullsum}&ownstructure=${ownstructure}&hidezombnull=${hidezombnull}&lang=RU`;
const reportPage = `https://faberlic.com/rssreports/otchet.php?linkreport=/ReportServer/Pages/ReportViewer.aspx?%2fRPP%2fConsultantTreeMLM&rs:Command=Render&rc:Stylesheet=htmlviewer&cons=1001494180387&period=${period}&cur=445&ownstructure=${ownstructure}&withzero=${nullsum}&lang=RU`;
console.log(`Сформирован URL отчета: ${reportPage}`);
  
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
  
  // Ждем, пока SSRS "отлагает" внутри
  // await page.waitForFunction(() => {
  //   const v = window.$find("ReportViewerControl");
  //   return v && !v.get_isLoading();
  // });
  await page.waitForFunction(() => {
    const v = window.$find && window.$find("ReportViewerControl");
    // Если объект найден и он закончил загрузку — возвращаем true
    return v && typeof v.get_isLoading === 'function' && !v.get_isLoading();
  }, { timeout: 100000 });

  
  // Мы запускаем ожидание ПЕРЕД тем, как вызвать команду экспорта
  const downloadPromise = page.waitForEvent('download');
  await page.evaluate(() => {
    // Вызываем встроенную функцию ReportViewer
    $find('ReportViewerControl').exportReport('XML');
  });

  const download = await downloadPromise;

  // 4. Сохранение скачанного файла
  const path = 'ConsultantTreeMLM.xml';
  await download.saveAs(path);
  
  console.log(`Файл успешно скачан и сохранен в: ${path}`);

  await browser.close();
})();
