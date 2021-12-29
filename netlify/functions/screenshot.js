require("dotenv").config();
const { builder } = require("@netlify/functions");
const chromium = require("chrome-aws-lambda");

async function screenshot(user, year, total, stars) {
  const baseURL = process.env.URL;
  const url = `${baseURL}/social-template/`;
  let options = {
    type: "jpeg",
    encoding: "base64",
    quality: 80,
  };
  let pageData = {
    user: decodeURIComponent(user),
    year: decodeURIComponent(year),
    total: decodeURIComponent(total),
    stars: decodeURIComponent(stars),
  };

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: ["domcontentloaded"],
    timeout: 3000,
  });

  await page.evaluateHandle("document.fonts.ready");

  await page.setViewport({
    width: 600,
    height: 315,
    deviceScaleFactor: 2,
  });

  await page.evaluate(({ user, year, total, stars }) => {
    const userEl = document.querySelector(".user");
    const yearEl = document.querySelector(".year");
    const totalEl = document.querySelector(".total");
    const starsEl = document.querySelector(".starred");

    if (user) {
      userEl.innerHTML = user;
    }
    if (year) {
      yearEl.innerHTML = year;
    }
    if (total) {
      totalEl.innerHTML = total;
    }
    if (stars) {
      starsEl.innerHTML = stars;
    }
  }, pageData);

  let output = await page.screenshot(options);

  await browser.close();

  return output;
}

async function handler(event, _context) {
  let pathSplit = event.path.split("/").filter((entry) => !!entry);
  let [_base, user, year, total, stars] = pathSplit;

  try {
    let output = await screenshot(user, year, total, stars);

    return {
      statusCode: 200,
      headers: {
        "content-type": `image/jpeg`,
      },
      body: output,
      isBase64Encoded: true,
    };
  } catch (error) {
    console.log("Error", error);

    return {
      statusCode: 200,
      headers: {
        "content-type": "image/svg+xml",
      },
      body: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="#b1eae5"><rect width="400" height="300" /></svg>`,
      isBase64Encoded: false,
    };
  }
}

exports.handler = builder(handler);
