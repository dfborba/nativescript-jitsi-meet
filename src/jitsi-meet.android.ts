import * as application from "tns-core-modules/application";
import { JitsiMeetConferenceOptions } from './jitsi-meet-options';
import { JitsiMeet } from "./jitsi-meet.common";

export class JitsiMeetImpl implements JitsiMeet  {
	private _configuration: io.witfy.jitsiconnector.config.JitsiConnectorConfiguration;
	private _options: JitsiMeetConferenceOptions;

	constructor(o?: JitsiMeetConferenceOptions) {
		let featureFlagsMap = new io.witfy.jitsiconnector.config.JitsiConnectorFeatureFlagConfiguration();
		this.options = o;

		if (!!this.options) {
			if (!!this.options.featureFlags) {
				if (this.options.featureFlags.calendarEnabled !== undefined) {
					featureFlagsMap.setCalendarEnabled(this.options.featureFlags.calendarEnabled);
				} else {
					featureFlagsMap.setCalendarEnabled(true);
				}

				if (this.options.featureFlags.callIntegration !== undefined) {
					featureFlagsMap.setCallIntegrationEnabled(this.options.featureFlags.callIntegration);
				} else {
					featureFlagsMap.setCallIntegrationEnabled(true);
				}

				if (this.options.featureFlags.chatEnabled !== undefined) {
					featureFlagsMap.setChatEnabled(this.options.featureFlags.chatEnabled);
				} else {
					featureFlagsMap.setChatEnabled(true);
				}

				if (this.options.featureFlags.inviteEnabled !== undefined) {
					featureFlagsMap.setInviteEnabled(this.options.featureFlags.inviteEnabled);
				} else {
					featureFlagsMap.setInviteEnabled(true);
				}

				if (this.options.featureFlags.iosRecordingEnabled !== undefined) {
					featureFlagsMap.setIosRecordingEnabled(this.options.featureFlags.iosRecordingEnabled);
				} else {
					featureFlagsMap.setIosRecordingEnabled(false);
				}

				if (this.options.featureFlags.pipEnabled !== undefined) {
					featureFlagsMap.setPipEnabled(this.options.featureFlags.pipEnabled);
				} else {
					featureFlagsMap.setPipEnabled(false);
				}
			}

			this._configuration = new io.witfy.jitsiconnector.config.JitsiConnectorConfiguration();
			this._configuration.setAudioMuted(this.options.audioMuted);
			this._configuration.setAudioOnly(this.options.audioOnly);
			this._configuration.setVideoMuted(this.options.videoMuted);
			this._configuration.setFeatureFlags(featureFlagsMap);
		} else {
			featureFlagsMap.setCalendarEnabled(true);
			featureFlagsMap.setCallIntegrationEnabled(true);
			featureFlagsMap.setChatEnabled(true);
			featureFlagsMap.setInviteEnabled(true);
			featureFlagsMap.setIosRecordingEnabled(false);
			featureFlagsMap.setPipEnabled(false);

			this._configuration = new io.witfy.jitsiconnector.config.JitsiConnectorConfiguration();
			this._configuration.setAudioMuted(this.options.audioMuted);
			this._configuration.setAudioOnly(this.options.audioOnly);
			this._configuration.setVideoMuted(this.options.videoMuted);
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

	get options(): JitsiMeetConferenceOptions {
		return this._options;
	}

	set options(options: JitsiMeetConferenceOptions) {
		this._options = options;
	}
}
