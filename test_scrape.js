const puppeteer = require('puppeteer');

async function test() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.bancoprovincia.com.ar/cuentadni/contenidos/cdniBeneficios/', {waitUntil: 'networkidle2'});
  
  const modalId = await page.evaluate(() => {
    return document.querySelector('.modalLink').id;
  });

  console.log('Clicking modal ID:', modalId);
  await page.click(`.modalLink[id="${modalId}"]`);
  await new Promise(r => setTimeout(r, 2000));
  
  const data = await page.evaluate(() => {
    // Buscar cualquier div que tenga el texto Tope
    return Array.from(document.querySelectorAll('div, p, span, article'))
      .filter(el => el.innerText && el.innerText.includes('Tope de reintegro'))
      .map(el => el.innerText.trim().replace(/\n+/g, ' | '));
  });
  
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}
test();
