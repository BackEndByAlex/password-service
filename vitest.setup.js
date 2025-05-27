import { vi } from 'vitest'

vi.mock('fs', () => ({
  default: {
    /**
     * Mock implementation of readFileSync.
     *
     * @param {string} path - The file path to read.
     * @returns {string} The mock file content based on the file path.
     */
    readFileSync: (path) => {
      if (path.includes('private.pem')) return 'MOCK_PRIVATE_KEY'
      if (path.includes('public.pem')) return 'MOCK_PUBLIC_KEY'
      return ''
    }
  }
}))
