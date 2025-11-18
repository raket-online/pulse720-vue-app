import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PillarCard from '../PillarCard.vue'
import type { Pillar } from '@/lib/supabase'

describe('PillarCard', () => {
  const mockPillar: Pillar = {
    id: '123',
    user_id: 'user-123',
    title: 'Test Pillar',
    score: 8,
    advice: 'Great content coverage',
    create_date: '2025-11-18T00:00:00Z',
    last_updated: '2025-11-18T10:00:00Z',
  }

  it('renders pillar title correctly', () => {
    const wrapper = mount(PillarCard, {
      props: {
        pillar: mockPillar,
      },
    })

    expect(wrapper.text()).toContain('Test Pillar')
  })

  it('displays score when available', () => {
    const wrapper = mount(PillarCard, {
      props: {
        pillar: mockPillar,
      },
    })

    expect(wrapper.text()).toContain('8/10')
  })

  it('displays advice when available', () => {
    const wrapper = mount(PillarCard, {
      props: {
        pillar: mockPillar,
      },
    })

    expect(wrapper.text()).toContain('Great content coverage')
  })

  it('shows empty state when no score or advice', () => {
    const pillarWithoutData: Pillar = {
      ...mockPillar,
      score: null,
      advice: null,
    }

    const wrapper = mount(PillarCard, {
      props: {
        pillar: pillarWithoutData,
      },
    })

    expect(wrapper.text()).toContain('No resources added yet')
  })

  it('emits select event when card is clicked', async () => {
    const wrapper = mount(PillarCard, {
      props: {
        pillar: mockPillar,
      },
    })

    await wrapper.find('.card').trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([mockPillar])
  })

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(PillarCard, {
      props: {
        pillar: mockPillar,
      },
    })

    const editButton = wrapper.findAll('button')[0]
    await editButton.trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')?.[0]).toEqual([mockPillar])
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(PillarCard, {
      props: {
        pillar: mockPillar,
      },
    })

    const deleteButton = wrapper.findAll('button')[1]
    await deleteButton.trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual([mockPillar])
  })

  it('applies selected styling when isSelected is true', () => {
    const wrapper = mount(PillarCard, {
      props: {
        pillar: mockPillar,
        isSelected: true,
      },
    })

    expect(wrapper.find('.card').classes()).toContain('ring-2')
    expect(wrapper.find('.card').classes()).toContain('ring-primary-500')
  })

  it('displays correct score color for high score', () => {
    const wrapper = mount(PillarCard, {
      props: {
        pillar: mockPillar, // score: 8
      },
    })

    const scoreElement = wrapper.find('.bg-green-100')
    expect(scoreElement.exists()).toBe(true)
    expect(scoreElement.classes()).toContain('text-green-800')
  })

  it('displays correct score color for medium score', () => {
    const mediumScorePillar: Pillar = {
      ...mockPillar,
      score: 6,
    }

    const wrapper = mount(PillarCard, {
      props: {
        pillar: mediumScorePillar,
      },
    })

    const scoreElement = wrapper.find('.bg-yellow-100')
    expect(scoreElement.exists()).toBe(true)
  })

  it('displays correct score color for low score', () => {
    const lowScorePillar: Pillar = {
      ...mockPillar,
      score: 3,
    }

    const wrapper = mount(PillarCard, {
      props: {
        pillar: lowScorePillar,
      },
    })

    const scoreElement = wrapper.find('.bg-red-100')
    expect(scoreElement.exists()).toBe(true)
  })

  it('formats date correctly for today', () => {
    const todayPillar: Pillar = {
      ...mockPillar,
      last_updated: new Date().toISOString(),
    }

    const wrapper = mount(PillarCard, {
      props: {
        pillar: todayPillar,
      },
    })

    expect(wrapper.text()).toContain('today')
  })

  it('prevents event bubbling for edit and delete buttons', async () => {
    const wrapper = mount(PillarCard, {
      props: {
        pillar: mockPillar,
      },
    })

    const editButton = wrapper.findAll('button')[0]
    await editButton.trigger('click')

    // Select event should not be emitted when clicking edit button
    expect(wrapper.emitted('select')).toBeFalsy()
  })
})
