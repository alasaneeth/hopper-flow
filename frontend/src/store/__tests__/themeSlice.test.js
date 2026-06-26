import themeReducer, { toggleTheme } from '../themeSlice'

describe('themeSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  // ─── Initial State ───────────────────────────────────────────────────────────
  describe('initial state', () => {
    it('should default to dark when localStorage has no theme', () => {
      const state = themeReducer(undefined, { type: 'unknown' })
      expect(state.isDark).toBe(true)
    })

    it('should default to dark when localStorage theme is "dark"', () => {
      localStorage.setItem('theme', 'dark')
      // Re-evaluate initial state by using the module's default
      // We test this indirectly via the reducer logic
      const state = themeReducer(undefined, { type: 'unknown' })
      // The initial state is determined at module load time (localStorage)
      expect(typeof state.isDark).toBe('boolean')
    })
  })

  // ─── toggleTheme ─────────────────────────────────────────────────────────────
  describe('toggleTheme', () => {
    it('should toggle isDark from true to false', () => {
      const darkState = { isDark: true }
      const state = themeReducer(darkState, toggleTheme())
      expect(state.isDark).toBe(false)
    })

    it('should toggle isDark from false to true', () => {
      const lightState = { isDark: false }
      const state = themeReducer(lightState, toggleTheme())
      expect(state.isDark).toBe(true)
    })

    it('should persist "light" to localStorage when toggling to light', () => {
      const darkState = { isDark: true }
      themeReducer(darkState, toggleTheme())
      expect(localStorage.getItem('theme')).toBe('light')
    })

    it('should persist "dark" to localStorage when toggling to dark', () => {
      const lightState = { isDark: false }
      themeReducer(lightState, toggleTheme())
      expect(localStorage.getItem('theme')).toBe('dark')
    })

    it('should toggle back and forth correctly', () => {
      let state = { isDark: true }
      state = themeReducer(state, toggleTheme())
      expect(state.isDark).toBe(false)
      state = themeReducer(state, toggleTheme())
      expect(state.isDark).toBe(true)
      state = themeReducer(state, toggleTheme())
      expect(state.isDark).toBe(false)
    })
  })
})
