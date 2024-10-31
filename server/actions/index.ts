"use server"

import { UserPreferences, Match } from '@/types'
import { mockUsers } from '@/lib/mock-data'

export async function findMatch(userPreferences: UserPreferences): Promise<Match | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const match = mockUsers.find(user =>
        user.jobTarget === userPreferences.jobTarget &&
        user.timezone === userPreferences.timezone &&
        user.availability.every(day => userPreferences.availability.includes(day))
    )

    if (match) {
        return {
            user1: { id: 'currentUser', ...userPreferences },
            user2: match,
        }
    }

    return null
}