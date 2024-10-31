import { MatchResult } from '@/types'

export const mockUsers: MatchResult[] = [
    {
        id: '1',
        jobTarget: 'Meta L4',
        timezone: 'UTC-8',
        availability: ['Monday', 'Wednesday', 'Friday'],
    },
    {
        id: '2',
        jobTarget: 'Google L3',
        timezone: 'UTC-5',
        availability: ['Tuesday', 'Thursday', 'Saturday'],
    },
    {
        id: '3',
        jobTarget: 'Amazon SDE II',
        timezone: 'UTC+0',
        availability: ['Monday', 'Tuesday', 'Wednesday'],
    },
    {
        id: '4',
        jobTarget: 'Microsoft SDE II',
        timezone: 'UTC+1',
        availability: ['Wednesday', 'Thursday', 'Friday'],
    },
    {
        id: '5',
        jobTarget: 'Apple SDE III',
        timezone: 'UTC+8',
        availability: ['Saturday', 'Sunday'],
    },
]