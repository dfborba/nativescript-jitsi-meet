export interface JitsiMeetConferenceOptions {
	audioMuted?: boolean;
	videoMuted?: boolean;
	audioOnly?: boolean;
	featureFlags?: {
		calendarEnabled?: boolean,
		callIntegration?: boolean,
		chatEnabled?: boolean,
		inviteEnabled?: boolean,
		iosRecordingEnabled?: boolean,
		pipEnabled?: boolean
		welcomePageEnabled?: boolean;
	};
}