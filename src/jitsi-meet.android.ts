import * as application from "tns-core-modules/application";
import { JitsiMeetConferenceOptions } from './jitsi-meet-configuration';

export class JitsiMeet {
	private _configuration: io.witfy.jitsiconnector.config.JitsiConnectorConfiguration;

	constructor(options?: JitsiMeetConferenceOptions) {
		let featureFlagsMap = new io.witfy.jitsiconnector.config.JitsiConnectorFeatureFlagConfiguration();

		if (!!options) {
			if (!!options.featureFlags) {
				if (options.featureFlags.calendarEnabled !== undefined) {
					featureFlagsMap.setCalendarEnabled(options.featureFlags.calendarEnabled);
				} else {
					featureFlagsMap.setCalendarEnabled(true);
				}

				if (options.featureFlags.callIntegration !== undefined) {
					featureFlagsMap.setCallIntegrationEnabled(options.featureFlags.callIntegration);
				} else {
					featureFlagsMap.setCallIntegrationEnabled(true);
				}

				if (options.featureFlags.chatEnabled !== undefined) {
					featureFlagsMap.setChatEnabled(options.featureFlags.chatEnabled);
				} else {
					featureFlagsMap.setChatEnabled(true);
				}

				if (options.featureFlags.inviteEnabled !== undefined) {
					featureFlagsMap.setInviteEnabled(options.featureFlags.inviteEnabled);
				} else {
					featureFlagsMap.setInviteEnabled(true);
				}

				if (options.featureFlags.iosRecordingEnabled !== undefined) {
					featureFlagsMap.setIosRecordingEnabled(options.featureFlags.iosRecordingEnabled);
				} else {
					featureFlagsMap.setIosRecordingEnabled(false);
				}

				if (options.featureFlags.pipEnabled !== undefined) {
					featureFlagsMap.setPipEnabled(options.featureFlags.pipEnabled);
				} else {
					featureFlagsMap.setPipEnabled(false);
				}
			}

			this._configuration = new io.witfy.jitsiconnector.config.JitsiConnectorConfiguration();
			this._configuration.setAudioMuted(options.audioMuted);
			this._configuration.setAudioOnly(options.audioOnly);
			this._configuration.setVideoMuted(options.videoMuted);
			this._configuration.setFeatureFlags(featureFlagsMap);
		} else {
			featureFlagsMap.setCalendarEnabled(true);
			featureFlagsMap.setCallIntegrationEnabled(true);
			featureFlagsMap.setChatEnabled(true);
			featureFlagsMap.setInviteEnabled(true);
			featureFlagsMap.setIosRecordingEnabled(false);
			featureFlagsMap.setPipEnabled(false);

			this._configuration = new io.witfy.jitsiconnector.config.JitsiConnectorConfiguration();
			this._configuration.setAudioMuted(options.audioMuted);
			this._configuration.setAudioOnly(options.audioOnly);
			this._configuration.setVideoMuted(options.videoMuted);
			this._configuration.setFeatureFlags(featureFlagsMap);
		}
	}

	public startMeeting(roomName: string) {
		const context = application.android.context;
		const jitsiConnector = new io.witfy.jitsiconnector.JitsiConnectorActivity();

		jitsiConnector.setJitsiStateListener(new io.witfy.jitsiconnector.JitsiStateListener({
			onConferenceStarted: (test: string) => {
				console.log('## ' + test);
			},
			onConferenceTerminated: (url: string, error: string) => {
				console.log('url: ' + url);
				console.log('error: ' + error);
			},
			onConferenceWillJoin: (url: string) => {
				console.log('## onConferenceWillJoin URL = ' + url);
			},
			onConferenceJoined: (url: string) => {
				console.log('## onConferenceJoined ' + url);
			},
		}));

		if (!!roomName) {
			if (!this._configuration) {
				jitsiConnector.startVideo(context, roomName);
			} else {
				jitsiConnector.startVideo(context, roomName, this._configuration);
			}
		} else {
			throw 'Room name is mandatory in order to open Jitsi meet!';
		}
	}
}
