# dashlane-to-print

Creates a printable PDF out of Dashlane data (JSON format). Works on both Windows and macOS.

> NOTE: Currently only handles passwords (authentifiant entries).

## Requirements

- Node, ^12.18.0
- Google Chrome, ^83.0.0

## How To Use

Install using Node's package manager. A global install is recommended.

```bash
npm i -g dashlane-to-print
```

Usage: `dashlane-to-print <path-to-data> <output-path>`. Example:

```bash
dashlane-to-print "~/Downloads/Dashlane Export.json" "~/Desktop/Dashlane.pdf"
```
