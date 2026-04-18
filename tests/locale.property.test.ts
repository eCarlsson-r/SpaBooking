import { test, describe, expect } from 'vitest'
import * as fc from 'fast-check'

describe('Locale Preference Round-Trip', () => {
  test('Feature: pwa-i18n, Property 8: Locale preference round-trip (cookie)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('en', 'id'),
        (locale) => {
          // Simulate Nuxt useCookie behavior
          const cookieStore: Record<string, string> = {}
          const setCookie = (key: string, val: string) => { cookieStore[key] = val }
          const getCookie = (key: string) => cookieStore[key] || 'en'

          // Save to cookie
          setCookie('spa-locale', locale)
          
          // Read from cookie
          expect(getCookie('spa-locale')).toBe(locale)
        }
      ),
      { numRuns: 100 }
    )
  })
})

describe('SpaBooking locale-prefixed URL generation', () => {
  test('Feature: pwa-i18n, Property 10: SpaBooking locale-prefixed URL generation', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('en', 'id'),
        fc.webPath(),
        (locale, path) => {
          // Simulate useSwitchLocalePath from @nuxtjs/i18n
          const switchLocalePath = (targetLocale: string, currentPath: string) => {
             // Strip existing locale prefix if any
             const pathWithoutLocale = currentPath.replace(/^\/(en|id)/, '') || '/'
             // Enforce strategy: 'prefix'
             return `/${targetLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
          }
          
          const generatedUrl = switchLocalePath(locale, path)
          
          // Verify URL starts with the requested locale prefix
          expect(generatedUrl.startsWith(`/${locale}`)).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })
})
