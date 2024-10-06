import { atom } from 'jotai'
import type dayjs from 'dayjs'
import config from '@config'
import { isNewUserAtom } from '@renderer/shared/components/layout/store'
import { setSidebarDataAtom } from '@renderer/shared/components/layout/sidebar/dates/store'
import { addAlertAtom } from '@renderer/shared/components/notification/store'
import * as api from '@renderer/shared/api/fetch'

type Day = dayjs.Dayjs | null

export const onboardingStateAtom = atom<'onboarding' | 'loading'>('onboarding')

export const canGoNextAtom = atom(true)
export const inputIdsAtom = atom<string[]>([])
export const autoScrapeDatesAtom = atom(config.settings.autoScrapeNewDates)
export const apiKeyOpenAIAtom = atom('')

export const recommendButtonDisabledAtom = atom(false)

export const completeOnboardingAtom = atom(null, async (get, set) => {
  const form = {
    // inputIds: get(inputIdsAtom),
    config: {
      autoScrapeNewDates: get(autoScrapeDatesAtom),
      apiKeyOpenAI: get(apiKeyOpenAIAtom)
    }
  }

  set(onboardingStateAtom, 'loading')

  try {
    const dateList = await api.onboard(form)
    // if (dateList.length) {
    //   set(setSidebarDataAtom, dateList)
    // }
    set(isNewUserAtom, false)
    return true
  } catch (error) {
    set(addAlertAtom, { message: 'Failed to complete onboarding due to a server error.' })
    set(onboardingStateAtom, 'onboarding')
    console.error('Failed to backfill data', error)
    return false
  }
})

export const addInitialReferencesAtom = atom(null, async (get, set) => {
  const form = {
    inputIds: get(inputIdsAtom)
  }

  set(onboardingStateAtom, 'loading')

  try {
    const response = await api.addInitialReferences(form)
    set(onboardingStateAtom, 'onboarding')

    return true
  } catch (error) {
    set(addAlertAtom, { message: 'Failed to add reference papers due to a server error.' })
    set(onboardingStateAtom, 'onboarding')
    console.error('Failed to backfill data', error)
    return false
  }
})
