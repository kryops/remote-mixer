import { writeFileSync } from 'fs'
import { join } from 'path'

import xlsx from 'xlsx'

function parseHex(hex: string): number {
  return parseInt(hex, 16)
}

const workbook = xlsx.readFile(join(__dirname, 'source.xlsx'))
const worksheet = workbook.Sheets[workbook.SheetNames[1]]

interface Definition {
  category: string
  name: string
  bytes: number[]
}

const definitions: Definition[] = []

for (let row = 4; row < 4000; row++) {
  const name = worksheet['E' + row]?.v
  if (!name) continue

  let category = worksheet['B' + row]?.v
  if (!category) {
    for (let categoryRow = row - 1; categoryRow > 2; categoryRow--) {
      category = worksheet['B' + categoryRow]?.v
      if (category) break
    }
  }

  definitions.push({
    category,
    name,
    bytes: [
      parseHex(worksheet['O' + row]?.v),
      parseHex(worksheet['P' + row]?.v),
      parseHex(worksheet['Q' + row]?.v),
      parseHex(worksheet['R' + row]?.v),
    ],
  })
}

const content = `export const bytesByMessageType = new Map<string, number[]>([
${definitions
  .map(
    definition =>
      `  ['${definition.category}/${definition.name}', [${definition.bytes.join(
        ', '
      )}]],`
  )
  .join('\n')}
]);
`

writeFileSync(join(__dirname, 'message-mapping.ts'), content)
