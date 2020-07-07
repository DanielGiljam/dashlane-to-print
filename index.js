#!/usr/bin/env node

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */

const {spawn} = require("child_process")
const {readFile} = require("fs").promises
const {homedir} = require("os")
const {resolve} = require("path")

const ChromeLauncher = require("chrome-launcher")
const puppeteer = require("puppeteer-core")
const yargs = require("yargs")

const args = yargs
  .scriptName("dashlane-to-print")
  .usage(
    "$0 <path-to-data> <output-path>",
    "Creates a printable PDF out of Dashlane data (JSON format).",
    (yargs) => {
      yargs.positional("path-to-data", {
        description: "Path to input data (Dashlane data)",
        type: "string",
      })
      yargs.positional("output-path", {
        description: "Output file path",
        type: "string",
      })
    },
  )
  .option("chrome-path", {
    description: "Path to Chrome binary",
    type: "string",
  }).argv

const win32 = process.platform === "win32"

process.env.DASHLANE_TO_PRINT_DATA_PATH = resolve(
  args["path-to-data"].replace(/^~\//, homedir()),
)
process.env.DASHLANE_TO_PRINT_PDF_PATH = resolve(args["output-path"])

console.log("Starting Next server...")
const nextProcess = spawn(
  resolve(
    __dirname.replace(
      new RegExp(`node_modules${win32 ? "\\\\" : "/"}dashlane-to-print$`),
      "",
    ),
    "node_modules/.bin/next",
  ),
  ["start", __dirname],
  {shell: win32},
)
nextProcess.stderr.on("data", (data) => {
  console.error(data.toString().trim())
})
nextProcess.on("exit", (code, signal) => {
  if (signal === "SIGINT") {
    console.log("Stopped Next server.")
    process.exit()
  } else {
    process.exit(code)
  }
})

let chrome, browser

setTimeout(() => {
  (async () => {
    console.log("Launching Chrome...")
    chrome = await ChromeLauncher.launch({
      chromePath: args["chrome-path"]
        ? resolve(args["chrome-path"])
        : undefined,
      startingUrl: "http://localhost:3000",
      chromeFlags: ["--headless", "--disable-gpu"],
    })
    console.log("Connecting to browser...")
    browser = await puppeteer.connect({
      browserURL: `http://localhost:${chrome.port}`,
      product: "chrome",
    })
    const page = (await browser.pages()).find(
      (page) => page.url() === "http://localhost:3000/",
    )
    console.log("Generating PDF...")
    await page.pdf({
      path: process.env.DASHLANE_TO_PRINT_PDF_PATH,
      displayHeaderFooter: true,
      headerTemplate: await readFile(
        resolve(__dirname, "header-template.html"),
        "utf-8",
      ),
      footerTemplate: await readFile(
        resolve(__dirname, "footer-template.html"),
        "utf-8",
      ),
      printBackground: true,
      format: "A4",
      margin: {
        top: "20mm",
        right: "10mm",
        bottom: "20mm",
        left: "10mm",
      },
    })
    console.info(`Saved PDF to "${process.env.DASHLANE_TO_PRINT_PDF_PATH}".`)
  })()
    .catch((error) => {
      console.error(error)
      process.code = error.code
    })
    .finally(() => {
      console.log("Cleaning up...")
      browser.disconnect()
      console.log("Disconnected from browser.")
      return chrome
        .kill()
        .then(() => console.log("Stopped Chrome."))
        .catch((error) => console.error(error))
    })
    .then(() => {
      nextProcess.kill("SIGINT")
    })
}, 1000)
