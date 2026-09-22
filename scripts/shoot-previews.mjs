import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { templates } from '../src/data/site.js'

// Re-shoots the catalog's preview stills: one 1280x800 WebP per template that
// has a demoUrl, written to src/assets/previews/<id>.webp, which is where
// TemplatePreview picks them up. Run it by hand when a template is added or a
// demo has changed:
//
//   npm i -D playwright && npx playwright install chromium
//   node scripts/shoot-previews.mjs                 # every demo
//   node scripts/shoot-previews.mjs leanardjude     # just these ids
//
// playwright is deliberately not kept in package.json — its postinstall
// downloads a browser, and neither the site nor the deploy needs one.

const OUT = fileURLToPath(new URL('../src/assets/previews/', import.meta.url))

// Most demos have settled a couple of seconds after the network goes quiet.
// These three animate themselves in — or, in Field Ops, boot a game — and need
// longer before the first screen is the one worth a picture.
const SETTLE = 3500
const EXTRA = { 'field-ops': 9000, depth: 6000, scale: 5000 }

// A demo that opens on a gate is not showing its main screen yet, so the shot
// is taken behind it.
const ENTER = {
  leanardjude: async (page) => {
    await page.getByText('OPEN BAY DOORS').first().click({ timeout: 10000 })
  },
}

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({
  // The shot is taken at the desktop viewport the demos were designed for and
  // scaled down by the frame, so it matches .preview-viewport's 16/10 box. A
  // device scale factor of 2 would double the file for detail no card shows.
  deviceScaleFactor: 1,
  viewport: { width: 1280, height: 800 },
})

// Chromium encodes WebP through a canvas, which is one page kept open for the
// run rather than an image library in package.json.
const encoder = await context.newPage()
await encoder.goto('about:blank')

async function toWebp(png) {
  const encoded = await encoder.evaluate(async (source) => {
    const bitmap = await createImageBitmap(await (await fetch(source)).blob())
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    canvas.getContext('2d').drawImage(bitmap, 0, 0)
    return canvas.toDataURL('image/webp', 0.82)
  }, `data:image/png;base64,${png.toString('base64')}`)

  if (!encoded.startsWith('data:image/webp')) {
    throw new Error('this browser did not encode webp')
  }

  return Buffer.from(encoded.split(',')[1], 'base64')
}

const only = process.argv.slice(2)
const wanted = templates.filter(
  (entry) => entry.demoUrl && (only.length === 0 || only.includes(entry.id)),
)

for (const template of wanted) {
  const page = await context.newPage()

  try {
    await page.goto(template.demoUrl, { timeout: 60000, waitUntil: 'load' })
    // A demo that keeps a socket open or polls would never go idle, so the
    // quiet network is a nicety, not a requirement.
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {})
    await ENTER[template.id]?.(page)
    await page.waitForTimeout(EXTRA[template.id] ?? SETTLE)
    // Some demos restore a scroll position; the shot is always the top.
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)

    const shot = await toWebp(await page.screenshot({ type: 'png' }))
    writeFileSync(`${OUT}${template.id}.webp`, shot)
    console.log(`${template.id.padEnd(18)} ${(shot.length / 1024).toFixed(0)} kB`)
  } catch (error) {
    // One unreachable demo must not cost the rest of the run.
    console.log(`${template.id.padEnd(18)} FAILED — ${error.message.split('\n')[0]}`)
  } finally {
    await page.close()
  }
}

await browser.close()
