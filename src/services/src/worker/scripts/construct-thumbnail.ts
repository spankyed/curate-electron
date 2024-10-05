// base image made with https://hotpot.ai/
import sharp from 'sharp';
import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { pipeline } from 'stream';
import { promisify } from 'util';

const root = '/Users/spankyed/Develop/Projects/CurateGPT/services/src/worker/service';

// Register the font
registerFont(path.join(root, 'assets', 'Roboto-Bold.ttf'), { family: 'Roboto' });

async function downloadImage(url: string, outputPath: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  if (!response.body) throw new Error('No response body');
  await promisify(pipeline)(response.body, fs.createWriteStream(outputPath));
}

function getEmojiUrl(unicode: string) {
  const codePoints = unicode?.codePointAt(0)?.toString(16);
  return `https://twemoji.maxcdn.com/v/latest/72x72/${codePoints}.png`;
}

async function createCircularImage(imagePath: string, size: number): Promise<Buffer> {
  const circleSvg = `<svg><circle cx="${size/2}" cy="${size/2}" r="${size/2}"/></svg>`;
  const compositeOptions = [{ input: Buffer.from(circleSvg), blend: 'dest-in' as const }];

  return await sharp(imagePath)
    .resize(size, size)
    .composite(compositeOptions)
    .toBuffer();
}

export default async function createThumbnail(backgroundPath: string, themePath: string, decorationPath: string, outputPath: string, width: number, height: number): Promise<void> {
  console.clear()
  console.log('Creating thumbnail...');

  const size = height * 1.3; // Increase the size of the theme image by 3/10ths

  try {
    console.log('Creating circular theme image...');
    const circularThemeBuffer = await createCircularImage(themePath, size);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.antialias = 'subpixel'; // Enable subpixel antialiasing

    // Load images
    console.log('Loading images...');
    const background = await loadImage(backgroundPath);
    const theme = await loadImage(circularThemeBuffer);
    const decoration = await loadImage(decorationPath);

    // Download emoji images
    console.log('Downloading emoji images...');
    const robotEmojiPath = path.join(root, 'assets', 'robot_emoji.png');
    const packageEmojiPath = path.join(root, 'assets', 'package_emoji.png');
    await downloadImage(getEmojiUrl('🤖'), robotEmojiPath);
    await downloadImage(getEmojiUrl('📦'), packageEmojiPath);
    const robotEmoji = await loadImage(robotEmojiPath);
    const packageEmoji = await loadImage(packageEmojiPath);

    // Calculate positions
    const themePosition = width * .45; // Move the theme image to the right such that 55% is visible
    const themeVerticalPosition = (height - theme.height) / 2;
    const decorationVerticalPosition = height - (decoration.height * .35);
    const decorationHorizontalPosition = (width - decoration.width) * .52;

    // Draw images on canvas
    console.log('Drawing images on canvas...');
    ctx.drawImage(background, 0, 0, width, height);

    // Draw border around theme image
    ctx.strokeStyle = '#FFFF66';
    ctx.lineWidth = 7.5; // Adjust as needed
    ctx.globalAlpha = 0.85; // Set the opacity to 50%
    ctx.beginPath();
    ctx.arc(themePosition + theme.width / 2, themeVerticalPosition + theme.height / 2, theme.width / 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Draw theme image
    ctx.drawImage(theme, themePosition, themeVerticalPosition, theme.width, theme.height);
    ctx.drawImage(decoration, decorationHorizontalPosition, decorationVerticalPosition, decoration.width, decoration.height);

    // Add text
    console.log('Adding text...');
    const fontSize = 120;
    const lineHeight = fontSize * 0.8;
    const letterSpacing = fontSize * 0.09;
    const textX = width * 0.03;
    const textY = height * .4;
    ctx.font = `${fontSize}px Roboto`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('AI', textX, textY);
    ctx.fillStyle = '#FFFF66';
    ctx.fillText('Unboxed', textX, textY + lineHeight + letterSpacing);

    // Add emoji images
    console.log('Adding emoji images...');
    const emojiFontSize = 170;
    const emojiTextX = textX;
    const emojiTextY = textY + lineHeight + letterSpacing + emojiFontSize * .9;
    ctx.drawImage(robotEmoji, emojiTextX, emojiTextY, emojiFontSize, emojiFontSize);
    ctx.drawImage(packageEmoji, emojiTextX + emojiFontSize, emojiTextY, emojiFontSize, emojiFontSize);

    // Write the result to a file
    console.log('Writing result to file...');
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createJPEGStream();
    stream.pipe(out);

    console.log('Thumbnail created successfully');
  } catch (error) {
    console.error(`Error creating thumbnail: ${error}`);
  }
}

const bgPath = path.join(root, 'assets', 'background.png');
const themePath = path.join(root, 'assets', 'theme1.png');
const decorationPath = path.join(root, 'assets', 'decoration.png');
const outPath = path.join(root, 'output', 'thumbnail.jpg');

createThumbnail(bgPath, themePath, decorationPath, outPath, 1280, 720);
