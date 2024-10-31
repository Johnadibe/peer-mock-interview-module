"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPreferences } from '@/types'

interface PreferencesFormProps {
    initialPreferences?: UserPreferences;
    onSubmit: (preferences: UserPreferences) => void;
}

export default function PreferencesForm({ initialPreferences, onSubmit }: PreferencesFormProps) {
    const [preferences, setPreferences] = useState<UserPreferences>(
        initialPreferences || {
            jobTarget: '',
            timezone: '',
            availability: [],
        }
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(preferences)
    }

    const handleAvailabilityChange = (day: string) => {
        setPreferences(prev => ({
            ...prev,
            availability: prev.availability.includes(day)
                ? prev.availability.filter(d => d !== day)
                : [...prev.availability, day],
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="jobTarget">Job Target</Label>
                <Input
                    id="jobTarget"
                    value={preferences.jobTarget}
                    onChange={(e) => setPreferences({ ...preferences, jobTarget: e.target.value })}
                    placeholder="e.g., Meta L4"
                />
            </div>
            <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                    value={preferences.timezone}
                    onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}
                >
                    <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">UTC</SelectItem>
                        <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                        <SelectItem value="UTC+8">China Standard Time (UTC+8)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Availability</Label>
                <div className="grid grid-cols-2 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <Button
                            key={day}
                            type="button"
                            variant={preferences.availability.includes(day) ? "default" : "outline"}
                            onClick={() => handleAvailabilityChange(day)}
                        >
                            {day}
                        </Button>
                    ))}
                </div>
            </div>
            <Button type="submit">Save Preferences</Button>
        </form>
    )
}