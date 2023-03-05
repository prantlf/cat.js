#!/usr/bin/env node

import { createReadStream, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

function getPackage() {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  return JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))
}

const help = () => {
  console.log(`${getPackage().description}

Usage: cat.js [-AbeElnstTuv] [--] file...

Options:
  -A|--show-all          equivalent to -vET
  -b|--number-nonblank   number the non-blank output lines, starting at 1
  -e|--show-np-and-ends  equivalent to -vE
  -E|--show-ends         display a dollar sign ("$") at the end of each line
  -l|--lock              set an exclusive advisory lock on standard output;
                         if the output file is already locked, this command
                         will block until the lock is acquired
  -n|--number            number all output lines, starting at 1
  -s|--squeeze-blank     squeeze adjacent empty lines to a single one
  -t|--show-np-and-tabs  equivalent to -vT
  -T|--show-tabs         display TAB characters as "^I"
  -u|--unbuffering       ignored (originally disable output buffering)
  -v|--show-nonprinting  display non-printing characters so they are visible;
                         control characters as "^X", DEL character as "^?",
                         non-ASCII characters as "M-" and the ASCII character
  -V|--version           print version number
  -h|--help              print usage instructions

  If file is a single dash ("-") or absent, the standard input will be used.

Examples:
  $ cat.js a
  $ cat.js -s /tmp/a /tmp/b > /tmp/c`)
}

const { argv } = process
const args = []
let   numberContent, dollar, locking, numberAll, squeeze, tab, special

function fail(message) {
  console.error(message)
  process.exit(1)
}

function setSpecialNoTab(flag) {
  return special = flag && /[\u0001-\u0008]|[\u000b-\u001f]|[\u007f-\u00ff]/g
}

function setSpecialAll(flag) {
  return special = flag && /[\u0001-\u0009]|[\u000b-\u001f]|[\u007f-\u00ff]/g
}

for (let i = 2, l = argv.length; i < l; ++i) {
  const arg = argv[i]
  const match = /^(-|--)(no-)?([a-zA-Z][-a-zA-Z]*)(?:=(.*))?$/.exec(arg)
  if (match) {
    const parseArg = (arg, flag) => {
      switch (arg) {
        case 'A': case 'show-all':
          setSpecialAll(flag)
          dollar = flag
          return
        case 'b': case 'number-nonblank':
          numberContent = flag
          return
        case 'e': case 'show-np-and-ends':
          if (!tab) setSpecialNoTab(flag)
          dollar = flag
          return
        case 'E': case 'show-end':
          dollar = flag
          return
        case 'l': case 'lock':
          locking = import('os-lock')
          return
        case 'n': case 'number':
          numberAll = flag
          return
        case 's': case 'squeeze-blank':
          squeeze = flag
          return
        case 't': case 'show-np-and-tabs':
          setSpecialAll(flag)
          return
        case 'T': case 'show-tabs':
          if (special) setSpecialAll(flag)
          tab = flag
          return
        case 'u': case 'unbuffering':
          return
        case 'v': case 'show-nonprinting':
          if (!special) setSpecialNoTab(flag)
          return
        case 'V': case 'version':
          console.log(getPackage().version)
          process.exit(0)
          break
        case 'h': case 'help':
          help()
          process.exit(0)
      }
      fail(`unknown option: "${arg}"`)
    }
    if (match[1] === '-') {
      const flags = match[3].split('')
      for (const flag of flags) parseArg(flag, true)
    } else {
      parseArg(match[3], match[2] !== 'no-')
    }
    continue
  }
  if (arg === '--') {
    args.push(...argv.slice(i + 1, l))
    break
  }
  args.push(arg)
}

if (!args.length) {
  args.push('-')
}

const { lock, unlock } = locking ? await locking : {}
const { stdin, stdout } = process
const numbering = numberContent || numberAll

let specials
if (special) {
  specials = [
    '^@',  // 0
    '^A',  // 1
    '^B',  // 2
    '^C',  // 3
    '^D',  // 4
    '^E',  // 5
    '^F',  // 6
    '^G',  // 7
    '^H',  // 8
    '^I',  // 9
    '^J',  // 10
    '^K',  // 11
    '^L',  // 12
    '^M',  // 13
    '^N',  // 14
    '^O',  // 15
    '^P',  // 16
    '^Q',  // 17
    '^R',  // 18
    '^S',  // 19
    '^T',  // 20
    '^U',  // 21
    '^V',  // 22
    '^W',  // 23
    '^X',  // 24
    '^Y',  // 25
    '^Z',  // 26
    '^[',  // 27
    '^\\',  // 28
    '^]',  // 29
    '^^',  // 30
    '^_'  // 31
  ]
  specials[127] = '^?'
}

const nextInput = () => {
  const name = args.shift()
  if (name) return name === '-' ? stdin : createReadStream(name)
  if (lock) unlock(stdout.fd)
}

const handleError = ({ message }) => {
  if (lock) unlock(stdout.fd)
  fail(message)
}

try {
  let handleFile

  if (numbering || dollar || squeeze || special || tab) {
    const readline = (await import('readline')).default

    /* c8 ignore next 5 */
    const pad = number => number > 99999 ? number : 
      number > 9999 ? ` ${number}` :
      number > 999 ? `  ${number}` :
      number > 99 ? `   ${number}` :
      number > 9 ? `    ${number}` : `     ${number}`

    handleFile = () => {
      const input = nextInput()
      if (!input) return
      input.on('error', handleError)

      let number = 0
      let prevEmpty

      readline.createInterface({
        input, crlfDelay: Infinity
      })
      .on('line', line => {
        const empty = !line.length
        if (empty) {
          if (prevEmpty) {
            if (squeeze) return
          } else {
            prevEmpty = true
          }

          if (numberContent) {
            if (dollar) stdout.write('      \t$')
            return stdout.write('\n')
          }
        } else {
          prevEmpty = false
        }

        if (numbering) stdout.write(`${pad(++number)}\t`)
        if (special) {
          line = line.replace(special, matched => {
            const code = matched.charCodeAt(0)
            return code < 128 ? specials[code] :
              code < 160 ? `M-${specials[code - 128]}` :
              `M-${String.fromCharCode(code - 128)}`
          })
        } else if (tab) {
          line = line.replaceAll('\t', '^I')
        }
        stdout.write(line)
        if (dollar) stdout.write('$')
        stdout.write('\n')
      })
      .on('close', handleFile)
      .on('error', handleError)
    }
  } else {
    handleFile = () => {
      const input = nextInput()
      if (!input) return
      input
        .on('end', handleFile)
        .on('error', handleError)
        .pipe(stdout)
        .on('error', handleError)
    }
  }

  if (lock) await lock(stdout.fd, { exclusive: true })
  handleFile()
/* c8 ignore next 4 */
} catch({ message }) {
  console.error(message)
  process.exitCode = 1
}
