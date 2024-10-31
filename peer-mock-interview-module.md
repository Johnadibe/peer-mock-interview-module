# Peer Mock Interview Booking Module

This document contains the code for the Peer Mock Interview Booking module, including all implemented components and utility files.

## Table of Contents

1. [Types (types.ts)](#types)
2. [Preferences Form (PreferencesForm.tsx)](#preferences-form)
3. [Match Results View (MatchResultsView.tsx)](#match-results-view)
4. [Mock Data (mockData.ts)](#mock-data)
5. [Utilities (utils.ts)](#utilities)
6. [Main Page (PeerMockInterview.tsx)](#main-page)

## Types

File: `types/index.ts`

```typescript
export interface UserPreferences {
  jobTarget: string;
  timezone: string;
  availability: string[];
}

export interface MatchResult {
  id: string;
  jobTarget: string;
  timezone: string;
  availability: string[];
}

export interface Match {
  user1: MatchResult;
  user2: MatchResult;
}
```

## Preferences Form

File: `components/mock-interview/preferences-form.tsx`

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPreferences } from "@/types";

interface PreferencesFormProps {
  initialPreferences?: UserPreferences;
  onSubmit: (preferences: UserPreferences) => void;
}

export default function PreferencesForm({
  initialPreferences,
  onSubmit,
}: PreferencesFormProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(
    initialPreferences || {
      jobTarget: "",
      timezone: "",
      availability: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  const handleAvailabilityChange = (day: string) => {
    setPreferences((prev) => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter((d) => d !== day)
        : [...prev.availability, day],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="jobTarget">Job Target</Label>
        <Input
          id="jobTarget"
          value={preferences.jobTarget}
          onChange={(e) =>
            setPreferences({ ...preferences, jobTarget: e.target.value })
          }
          placeholder="e.g., Meta L4"
        />
      </div>
      <div>
        <Label htmlFor="timezone">Timezone</Label>
        <Select
          value={preferences.timezone}
          onValueChange={(value) =>
            setPreferences({ ...preferences, timezone: value })
          }
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
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <Button
              key={day}
              type="button"
              variant={
                preferences.availability.includes(day) ? "default" : "outline"
              }
              onClick={() => handleAvailabilityChange(day)}
            >
              {day}
            </Button>
          ))}
        </div>
      </div>
      <Button type="submit">Save Preferences</Button>
    </form>
  );
}
```

## Match Results View

File: `components/mock-interview/match-results-view.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPreferences, Match } from "@/types";
import { findMatch } from "@/server/actions";
import { toast } from "sonner";

interface MatchResultsViewProps {
  userPreferences: UserPreferences;
}

export default function MatchResultsView({
  userPreferences,
}: MatchResultsViewProps) {
  const [match, setMatch] = useState<Match | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchForMatch = async () => {
      setIsSearching(true);
      const result = await findMatch(userPreferences);
      setIsSearching(false);
      if (result) {
        setMatch(result);
        toast.success("Match found!");
      } else {
        setMatch(null);
        toast.error("No match found. We'll keep looking!");
      }
    };

    searchForMatch();
  }, [userPreferences]);

  if (isSearching) {
    return <div>Searching for a match...</div>;
  }

  if (!match) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Match Found</CardTitle>
          <CardDescription>
            We'll keep looking for a suitable match based on your preferences.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Found!</CardTitle>
        <CardDescription>
          Here are the details of your matched peer:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Job Target:</strong> {match.user2.jobTarget}
        </p>
        <p>
          <strong>Timezone:</strong> {match.user2.timezone}
        </p>
        <p>
          <strong>Availability:</strong> {match.user2.availability.join(", ")}
        </p>
        <Button className="mt-4">Schedule Interview</Button>
      </CardContent>
    </Card>
  );
}
```

## Mock Data

File: `mockData.ts`

```typescript
import { MatchResult } from "@/types";

export const mockUsers: MatchResult[] = [
  {
    id: "1",
    jobTarget: "Meta L4",
    timezone: "UTC-8",
    availability: ["Monday", "Wednesday", "Friday"],
  },
  {
    id: "2",
    jobTarget: "Google L3",
    timezone: "UTC-5",
    availability: ["Tuesday", "Thursday", "Saturday"],
  },
  {
    id: "3",
    jobTarget: "Amazon SDE II",
    timezone: "UTC+0",
    availability: ["Monday", "Tuesday", "Wednesday"],
  },
  {
    id: "4",
    jobTarget: "Microsoft SDE II",
    timezone: "UTC+1",
    availability: ["Wednesday", "Thursday", "Friday"],
  },
  {
    id: "5",
    jobTarget: "Apple SDE III",
    timezone: "UTC+8",
    availability: ["Saturday", "Sunday"],
  },
];
```

## Utilities

File: `server/actions/index.ts`

```typescript
"use server";

import { UserPreferences, Match } from "@/types";
import { mockUsers } from "@/lib/mock-data";

export async function findMatch(
  userPreferences: UserPreferences
): Promise<Match | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const match = mockUsers.find(
    (user) =>
      user.jobTarget === userPreferences.jobTarget &&
      user.timezone === userPreferences.timezone &&
      user.availability.every((day) =>
        userPreferences.availability.includes(day)
      )
  );

  if (match) {
    return {
      user1: { id: "currentUser", ...userPreferences },
      user2: match,
    };
  }

  return null;
}
```

## Main Page

File: `components/mock-interview/peer-mock-interview.tsx`

```tsx
"use client";

import { useState } from "react";
import { Toaster } from "sonner";
import PreferencesForm from "./preferences-form";
import MatchResultsView from "./match-results-view";
import { UserPreferences } from "@/types";

export default function PeerMockInterview() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    jobTarget: "",
    timezone: "",
    availability: [],
  });

  const handlePreferencesSubmit = (newPreferences: UserPreferences) => {
    setUserPreferences(newPreferences);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Peer Mock Interview Booking
      </h1>
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
  );
}
```

This module implements a Peer Mock Interview Booking feature with a preferences form and match results view. It uses React useState hook for state management and includes a notification system using the sooner library.
