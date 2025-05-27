import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getPasswordById } from '../src/controller/api/getPasswordById.js'
import { PasswordEntry } from '../src/models/PasswordEntry.js'

describe('getPasswordById', () => {
  let req, res, next

  beforeEach(() => {
    req = { params: { id: 'id123' } }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    next = vi.fn()
  })

  afterEach(() => vi.restoreAllMocks())

  it('ska returnera 404 om inte hittad', async () => {
    vi.spyOn(PasswordEntry, 'findById').mockResolvedValueOnce(null)
    await getPasswordById(req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Lösenordet hittades inte' })
  })

  it('ska returnera 200 + objekt när hittad', async () => {
    const fake = {
      _id: 'id123',
      service: 'X',
      username: 'U',
      /**
       * Returns the decrypted password.
       *
       * @returns {string} The plain text password.
       */
      getDecryptedPassword: () => 'plain'
    }
    vi.spyOn(PasswordEntry, 'findById').mockResolvedValueOnce(fake)
    await getPasswordById(req, res, next)
    expect(res.json).toHaveBeenCalledWith({
      _id: 'id123',
      service: 'X',
      username: 'U',
      password: 'plain'
    })
  })
})
