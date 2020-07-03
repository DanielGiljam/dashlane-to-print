/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */

const {spawn} = require("child_process")
const {writeFile} = require("fs").promises

const puppeteer = require("puppeteer")
const yargs = require("yargs")

const args = yargs.options({
  data: {
    demandOption: true,
    description: "Path to input data (Dashlane data).",
    type: "string",
  },
  pdf: {
    default: "dashlane.pdf",
    description: "Output file path.",
    type: "string",
  },
}).argv

process.env.DASHLANE_TO_PRINT_DATA_PATH = args.data
process.env.DASHLANE_TO_PRINT_PDF_PATH = args.pdf

const nextProcess = spawn("next", ["start"])
console.log("Started Next server...")
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

setTimeout(() => {
  (async () => {
    console.log("Starting headless browser...")
    const browser = await puppeteer.launch({headless: true})
    console.log("Loading page...")
    const page = await browser.newPage()
    await page.goto("http://localhost:3000", {waitUntil: "networkidle2"})
    console.log("Loaded page.")
    console.log("Writing PDF...")
    const pdf = await page.pdf({format: "A4"})
    await writeFile("dashlane.pdf", pdf)
    console.log("Wrote PDF.")
    await browser.close()
    console.log("Stopped headless browser.")
  })()
    .catch((error) => {
      console.error(error)
      process.code = error.code
    })
    .finally(() => {
      nextProcess.kill("SIGINT")
    })
}, 1000)
