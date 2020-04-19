import * as application from "tns-core-modules/application";

export interface JitsiMeetConferenceOptions {
	audioMuted: boolean;
	videoMuted: boolean;
	audioOnly: boolean;
	welcomePageEnabled: boolean;
	featureFlags: []
}

export class JitsiMeet {
	public startMeeting(roomName: string) {
		const context = application.android.context;
		const jitsiConnector = new io.witfy.jitsiconnector.JitsiConnector();

		if (!!roomName) {
			jitsiConnector.startVideo(context, roomName);
		} else {
			throw 'Room name is mandatory in order to open Jitsi meet!';
		}
	}
}
