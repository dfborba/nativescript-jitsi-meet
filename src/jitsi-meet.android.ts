import * as application from "tns-core-modules/application";
import { NativescriptJitsiMeetConferenceOptions } from "./jitsi-meet.common";

export class NativescriptJitsiMeet  {
	private _eventListeners: Array<{ event: string, callback: Function }>;
	private _serverURL: string = '';
	private _jitsiView: io.witfy.jitsiconnector.JitsiConnectorActivity;

	constructor(serverURL?: string) {
		this._eventListeners = new Array();
		this._serverURL = !!serverURL ? serverURL : 'https://meet.jit.si';
	}

	public startMeeting(options: NativescriptJitsiMeetConferenceOptions) {
		const context = application.android.context;
		this._jitsiView = new io.witfy.jitsiconnector.JitsiConnectorActivity();

		// this._jitsiView.setJitsiStateListener(new io.witfy.jitsiconnector.JitsiStateListener({
		// 	onConferenceStarted: (test: string) => {
		// 		console.log('## ' + test);
		// 	},
		// 	onConferenceTerminated: (url: string, error: string) => {
		// 		console.log('url: ' + url);
		// 		console.log('error: ' + error);
		// 	},
		// 	onConferenceWillJoin: (url: string) => {
		// 		console.log('## onConferenceWillJoin URL = ' + url);
		// 	},
		// 	onConferenceJoined: (url: string) => {
		// 		console.log('## onConferenceJoined ' + url);
		// 	},
		// }));

		const configuration = this._buildObjectOptions(options);

		if (configuration) {
			this._jitsiView.startVideo(context, options.roomName, configuration);
		}
	}

	private _buildObjectOptions(options: NativescriptJitsiMeetConferenceOptions): io.witfy.jitsiconnector.config.JitsiConnectorConfiguration {
		let configuration: io.witfy.jitsiconnector.config.JitsiConnectorConfiguration;
		let featureFlagsMap = new io.witfy.jitsiconnector.config.JitsiConnectorFeatureFlagConfiguration();

		if (!!options) {
			if (!!options.featureFlags) {
				featureFlagsMap.setCalendarEnabled(
					!!options.featureFlags.calendarEnabled
						? options.featureFlags.calendarEnabled : false);
				featureFlagsMap.setCallIntegrationEnabled(
					!!options.featureFlags.callIntegration
						? options.featureFlags.callIntegration : false);

				featureFlagsMap.setChatEnabled(
					!!options.featureFlags.chatEnabled
						? options.featureFlags.chatEnabled : false);

				featureFlagsMap.setInviteEnabled(
					!!options.featureFlags.inviteEnabled
						? options.featureFlags.inviteEnabled : false);

				featureFlagsMap.setCloseCaptionsEnabled(
					!!options.featureFlags.closeCaptionsEnabled
						? options.featureFlags.closeCaptionsEnabled : false);

				featureFlagsMap.setIosRecordingEnabled(
					!!options.featureFlags.iosRecordingEnabled
						? options.featureFlags.iosRecordingEnabled : false);

				featureFlagsMap.setPipEnabled(
					options.featureFlags.pipEnabled
						? options.featureFlags.pipEnabled : false);
			}
		} else {
			featureFlagsMap.setCalendarEnabled(true);
			featureFlagsMap.setCallIntegrationEnabled(true);
			featureFlagsMap.setChatEnabled(true);
			featureFlagsMap.setInviteEnabled(true);
			featureFlagsMap.setIosRecordingEnabled(false);
			featureFlagsMap.setPipEnabled(false);
		}

		configuration = new io.witfy.jitsiconnector.config.JitsiConnectorConfiguration();
		configuration.setAudioMuted(options.audioMuted);
		configuration.setAudioOnly(options.audioOnly);
		configuration.setVideoMuted(options.videoMuted);
		configuration.setFeatureFlags(featureFlagsMap);

		return configuration;
	}

	private _callEventListeners(eventName: string, data: NSDictionary<string, any>) {
		const eventListener = this._eventListeners.find(eventListener => eventListener.event === eventName);
		if (!!eventListener) {
			eventListener.callback(data.allValues.firstObject);
		}
	}

	on(eventName: string, callback: Function) {
		if (eventName === 'conferenceWillJoin'
			|| eventName === 'conferenceJoined'
				|| eventName === 'conferenceTerminated') {
			if (!this._eventListeners.find(eventListener => eventListener.event === eventName)) {
				this._eventListeners.push({ event: eventName, callback: callback });
			}
		}
	}

	addEventListener(event: string, callback: Function) {
		this.on(event, callback);
	}
}
