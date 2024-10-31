"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPreferences, Match } from '@/types'
import { findMatch } from '@/server/actions'
import { toast } from 'sonner'

interface MatchResultsViewProps {
    userPreferences: UserPreferences;
}

export default function MatchResultsView({ userPreferences }: MatchResultsViewProps) {
    const [match, setMatch] = useState<Match | null>(null)
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        const searchForMatch = async () => {
            setIsSearching(true)
            const result = await findMatch(userPreferences)
            setIsSearching(false)
            if (result) {
                setMatch(result)
                toast.success('Match found!')
            } else {
                setMatch(null)
                toast.error('No match found. We\'ll keep looking!')
            }
        }

        searchForMatch()
    }, [userPreferences])

    if (isSearching) {
        return <div>Searching for a match...</div>
    }

    if (!match) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Match Found</CardTitle>
                    <CardDescription>We'll keep looking for a suitable match based on your preferences.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Match Found!</CardTitle>
                <CardDescription>Here are the details of your matched peer:</CardDescription>
            </CardHeader>
            <CardContent>
                <p><strong>Job Target:</strong> {match.user2.jobTarget}</p>
                <p><strong>Timezone:</strong> {match.user2.timezone}</p>
                <p><strong>Availability:</strong> {match.user2.availability.join(', ')}</p>
                <Button className="mt-4">Schedule Interview</Button>
            </CardContent>
        </Card>
    )
}