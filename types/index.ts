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