import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getUserPasswords } from '../src/controller/api/getUserPasswords.js'
import { PasswordEntry } from '../src/models/PasswordEntry.js'

describe('getUserPasswords', () => {
  let req, res

  beforeEach(() => {
    req = { user: { uid: 'u1', email: 'e1' } }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
  })

  afterEach(() => vi.restoreAllMocks())

  it('hämtar med uid när det finns', async () => {
    vi.spyOn(PasswordEntry, 'find').mockResolvedValueOnce([{ foo: 'bar' }])
    vi.spyOn(PasswordEntry, 'getDecryptedPasswords').mockReturnValueOnce([{ foo: 'dec' }])

    await getUserPasswords(req, res)
    expect(PasswordEntry.find).toHaveBeenCalledWith({ userId: 'u1' })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith([{ foo: 'dec' }])
  })

  it('returnerar tom array om inget finns', async () => {
    vi.spyOn(PasswordEntry, 'find')
      .mockResolvedValueOnce([]) // första anropet (uid)
      .mockResolvedValueOnce([]) // andra anropet (email)
    await getUserPasswords(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith([])
  })

  it('returnerar 500 vid oväntat fel', async () => {
    vi.spyOn(PasswordEntry, 'find').mockRejectedValueOnce(new Error())
    await getUserPasswords(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Kunde inte hämta lösenord.' })
  })
})
