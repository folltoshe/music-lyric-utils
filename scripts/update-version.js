// @ts-check

import enquirer from 'enquirer'

import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { require, targets, rootVersion } from './utils.js'

const { prompt } = enquirer

/**
 * @param {string} pkgPath
 * @param {string} newVersion
 */
const handleUpdateVersion = (pkgPath, newVersion) => {
  const pkg = require(pkgPath)
  pkg.version = newVersion

  const target = JSON.stringify(pkg, null, 2) + '\n'
  writeFileSync(pkgPath, target)
}

const main = async () => {
  /** @type {{ version: string }} */
  const result = await prompt({
    type: 'input',
    name: 'version',
    message: 'Input new version',
    initial: rootVersion,
  })

  const newVersion = result.version.trim()
  if (!newVersion) throw new Error('bad new version')

  try {
    console.log(`try update version for root`)

    const pkgPath = join(process.cwd(), 'package.json')
    handleUpdateVersion(pkgPath, newVersion)

    console.log(`update version success for root`)
  } catch (err) {
    console.log(`update version error for root`)
  }

  for (const target of targets) {
    try {
      console.log(`try update version for ${target.id}`)

      const pkgPath = join(target.root, 'package.json')
      handleUpdateVersion(pkgPath, newVersion)

      console.log(`update version success for ${target.id}`)
    } catch (err) {
      console.log(`update version error for ${target.id}`)
    }
  }
}

main()
