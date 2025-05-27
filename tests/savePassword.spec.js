import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { savePassword } from '../src/controller/api/savePassword.js'
import { PasswordEntry } from '../src/models/PasswordEntry.js'

describe('savePassword', () => {
  let req, res

  beforeEach(() => {
    req = {
      user: { uid: 'u1', email: 'e1' },
      body: { service: 'X', username: 'U', password: 'P' }
    }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
  })

  afterEach(() => vi.restoreAllMocks())

  it('ska returnera 201 när save lyckas', async () => {
    vi.spyOn(PasswordEntry.prototype, 'save').mockResolvedValueOnce()
    await savePassword(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ message: 'Lösenord sparat!' })
  })

  it('ska returnera 500 när save kastar', async () => {
    vi.spyOn(PasswordEntry.prototype, 'save').mockRejectedValueOnce(new Error())
    await savePassword(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Kunde inte spara lösenord.' })
  })
})
