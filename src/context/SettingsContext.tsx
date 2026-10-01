import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { fetchSettings, type DbSettings } from '@/services/database'
import { restaurantConfig } from '@/config/restaurant'

interface SettingsContextValue {
  settings: DbSettings | null
  loading: boolean
  refresh: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DbSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const data = await fetchSettings()
      setSettings(data)
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}

// Fallback config that merges DB settings with static config
export function useRestaurantConfig() {
  const { settings } = useSettings()
  if (!settings) return restaurantConfig
  return {
    ...restaurantConfig,
    name: settings.name,
    nameLatin: settings.name_latin,
    tagline: settings.tagline || restaurantConfig.tagline,
    description: settings.description || restaurantConfig.description,
    logo: settings.logo || restaurantConfig.logo,
    favicon: settings.favicon || restaurantConfig.favicon,
    phone: settings.phone || restaurantConfig.phone,
    whatsapp: settings.whatsapp || restaurantConfig.whatsapp,
    address: settings.address || restaurantConfig.address,
    announcement: settings.announcement || restaurantConfig.announcement,
    announcementActive: settings.announcement_active,
    hero: {
      headline: settings.hero_headline || restaurantConfig.hero.headline,
      subheadline: settings.hero_subheadline || restaurantConfig.hero.subheadline,
      description: settings.hero_description || restaurantConfig.hero.description,
      primaryCta: settings.hero_primary_cta || restaurantConfig.hero.primaryCta,
      secondaryCta: settings.hero_secondary_cta || restaurantConfig.hero.secondaryCta,
    },
    openingHours: settings.opening_hours || restaurantConfig.openingHours,
    social: {
      facebook: settings.facebook || restaurantConfig.social.facebook,
      instagram: settings.instagram || restaurantConfig.social.instagram,
      tiktok: settings.tiktok || restaurantConfig.social.tiktok,
    },
    primaryColor: settings.primary_color || restaurantConfig.primaryColor,
    secondaryColor: settings.secondary_color || restaurantConfig.secondaryColor,
    accentColor: settings.accent_color || restaurantConfig.accentColor,
  }
}
