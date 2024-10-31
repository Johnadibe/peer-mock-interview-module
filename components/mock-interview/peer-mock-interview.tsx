"use client"

import { useState } from 'react'
import { Toaster } from 'sonner'
import PreferencesForm from './preferences-form'
import MatchResultsView from './match-results-view'
import { UserPreferences } from '@/types'

export default function PeerMockInterview() {
    const [userPreferences, setUserPreferences] = useState<UserPreferences>({
        jobTarget: '',
        timezone: '',
        availability: [],
    })

    const handlePreferencesSubmit = (newPreferences: UserPreferences) => {
        setUserPreferences(newPreferences)
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Peer Mock Interview Booking</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Your Preferences</h2>
                    <PreferencesForm
                        initialPreferences={userPreferences}
                        onSubmit={handlePreferencesSubmit}
                    />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Match Results</h2>
                    <MatchResultsView userPreferences={userPreferences} />
                </div>
            </div>
            <Toaster />
        </div>
    )
}