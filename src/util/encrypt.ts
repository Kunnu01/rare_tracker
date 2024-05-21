import { scryptSync, createCipheriv, createDecipheriv } from 'crypto'

const password = process.env.ENCRYPTION_PASSWORD
const salt = process.env.ENCRYPTION_SALT
const fixedIVText = process.env.ENCRYPTION_FIXED_IV ?? ''

const getKey = (): Buffer => {
  if (!salt) throw new Error('missing salt')
  if (!password) throw new Error('missing password')
  return scryptSync(password, salt, 32)
}

export const encrypt = (text: string) => {
  try {
    const key = getKey()
    const iv = Buffer.from(fixedIVText)
    const cipher = createCipheriv('aes-256-cbc', key, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const ivHex = iv.toString('hex')
    return `${ivHex}:${encrypted}`
  } catch (error) {
    console.error(error)
    return null
  }
}

export const decrypt = (encryptedText: string) => {
  try {
    const textParts = encryptedText.split(':')
    const iv = Buffer.from(textParts.shift()!, 'hex')
    const encrypted = textParts.join(':')
    const key = getKey()
    const decipher = createDecipheriv('aes-256-cbc', key, iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (error) {
    console.error(error)
    return null
  }
}
