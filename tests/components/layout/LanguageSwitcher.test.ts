import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LanguageSwitcher from '../../../app/components/layout/LanguageSwitcher.vue'

const mockNavigateTo = vi.fn()
const mockSwitchLocalePath = vi.fn((locale: string) => `/${locale}`)

// Mock Nuxt composables
vi.mock('#app', () => ({
  useI18n: () => ({
    locale: 'en'
  }),
  useSwitchLocalePath: () => vi.fn((locale) => `/${locale}`),
  navigateTo: vi.fn()
}))

vi.stubGlobal('useI18n', () => ({ locale: 'en' }))
vi.stubGlobal('useSwitchLocalePath', () => mockSwitchLocalePath)
vi.stubGlobal('navigateTo', mockNavigateTo)

// Mock Nuxt UI components
vi.mock('#components', () => ({
  UButton: {
    name: 'UButton',
    template: '<button><slot /></button>'
  },
  UDropdown: {
    name: 'UDropdown',
    template: '<div><slot /></div>',
    props: ['items']
  }
}))

describe('LanguageSwitcher', () => {
  const global = {
    stubs: {
      UButton: { template: '<button><slot /></button>' },
      UDropdown: { name: 'UDropdown', props: ['items'], template: '<div><slot /></div>' },
    },
  }

  it('renders the current locale', () => {
    const wrapper = mount(LanguageSwitcher, { global })
    expect(wrapper.text()).toContain('EN')
  })

  it('calls switchLocalePath and navigateTo when Indonesian is selected', async () => {
    const wrapper = mount(LanguageSwitcher, { global })
    const dropdown = wrapper.findComponent({ name: 'UDropdown' })
    const item = dropdown.props('items')[0][1]
    item.click()
    expect(mockSwitchLocalePath).toHaveBeenCalledWith('id')
    expect(mockNavigateTo).toHaveBeenCalledWith('/id')
  })

  it('defaults to "en" when no locale is set', () => {
    const wrapper = mount(LanguageSwitcher, { global })
    expect(wrapper.text()).toContain('EN')
  })
})
