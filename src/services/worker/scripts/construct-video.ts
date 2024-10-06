// ! enter discount code ANNUAL_30 while checkout to get 30% off FOR LIFE!
import { config } from 'dotenv';
import { chromium } from 'playwright';
config();

async function run(title: string, script: string) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the login page
  await page.goto('https://app.pictory.ai/login');

  // Type into the email and password inputs
  await page.type('input[type="text"]', process.env.EMAIL ?? '');
  await page.type('input[type="password"]', process.env.PICTORY_PASS ?? '');

  // Click the submit button and wait for navigation to complete
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type="submit"]'),
  ]);

  // Click the script to video button and wait for navigation to complete
  await Promise.all([
    page.waitForSelector('.script-video-name', { state: 'visible' }),
    page.click('.script-to-video-button'),
  ]);

  // Type into the title input
  await page.fill('.script-video-name input', title);

  // Click on the contenteditable div to focus it
  await page.click('[contenteditable]');

  // Type into the contenteditable div
  await page.keyboard.type(script);

  // Wait for the "Proceed" button to be enabled and click it
  await page.waitForSelector('button:enabled:has-text("Proceed")');
  await page.click('button:enabled:has-text("Proceed")');

  // Wait for the template to appear and click it
  const templateSelector = '#template_a33a3de8-39d1-4a80-b887-ba3c5e1a4464';
  await page.waitForSelector(templateSelector);
  await page.click(templateSelector);

  // Click the first aspect-ratio-card
  await page.click('.aspect-ratio-card');

  // Click on the "#tab-3" anchor tag
  const audio = 'a[href="#tab-3"]';
  await page.waitForSelector(audio);
  await page.click(audio);

  // Click on the "#tbinnertwo-2" anchor tag
  const voiceOver = 'a[href="#tbinnertwo-2"]';
  await page.waitForSelector(voiceOver);
  await page.click(voiceOver);

  // Click the first anchor tag inside of the ordered list with the class "list-inline"
  await page.click('.list-inline a');

  // Wait 2 seconds
  await page.waitForTimeout(2000);

  // Click the div with id "generate-button-dropdown"
  await page.click('#generate-button-dropdown');

  // Wait for the dropdown option for downloading the video to appear and click it
  await page.waitForSelector('#btnGenerate');
  await page.click('#btnGenerate');

  // Wait 5 seconds
  await page.waitForTimeout(5000);


  // TODO wait for video to finish processing than click last download button to save to dl folder

  // await browser.close();
}

// run('Test title', 'Test script');
run(
  'AI Brainstorm, Process Mining Revolution, Business Superpowers Unleashed!', 
  `Imagine you're driving a car. The car represents your business, and the journey represents your business processes. Now, traditionally, to navigate the journey, you'd need to understand maps, road signs, and maybe even some complex GPS equipment. This is like the traditional process mining - it's powerful, but it requires specific knowledge and skills.

  Now, imagine if your car had an advanced GPS system where you could just tell it where you want to go in plain language, and it would understand and guide you there. Not only that, but it could also understand complex requests like "find a route with the least traffic" or "find a route that passes by a gas station and a Chinese restaurant". This is what the AI in this research is doing for process mining. It's making it as easy to use as telling your GPS where you want to go.
  
  But there's more. This GPS isn't perfect. Sometimes it might not understand your request, or it might get confused by unusual road layouts. So, the researchers have developed a system to handle these situations, to correct errors, and to learn from them. This is like the AI's ability to handle complex queries, to generate meaningful responses, and to learn from its mistakes.
  
  So, in a nutshell, this research is about turning the complex map of process mining into an easy-to-use GPS system that anyone in your business can use to navigate your business processes.`
);
