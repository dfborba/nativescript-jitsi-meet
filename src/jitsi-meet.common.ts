export declare interface NativescriptJitsiMeetConferenceOptions {
	roomName: string,
	audioMuted?: boolean,
	videoMuted?: boolean,
	audioOnly?: boolean,
	featureFlags?: {
		calendarEnabled?: boolean,
		callIntegration?: boolean,
		closeCaptionsEnabled?: boolean,
		chatEnabled?: boolean,
		inviteEnabled?: boolean,
		iosRecordingEnabled?: boolean,
		pipEnabled?: boolean
		welcomePageEnabled?: boolean,
	},
	userInfo?: {
		displayName?: string,
		email?: string,
		avatar?: string
	}
}

export declare class NativescriptJitsiMeet {
    private _eventListeners: Array<{ event: string, callback: (url: string, error?: string) => void }>;
	private _serverURL: string;

	constructor();
	constructor(serverURL: string);

    startMeeting(options: NativescriptJitsiMeetConferenceOptions): void;
    stopMeeting(): void;
    on(event: string, callback: (url: string, error?: string) => void): void;
    addEventListener(event: string, callback: (url: string, error?: string) => void): void;
}
