declare module io {
	export module witfy {
		export module jitsiconnector {
			export module config {
				export class JitsiConnectorFeatureFlagConfiguration extends java.lang.Object {
					public static class: java.lang.Class<io.witfy.jitsiconnector.config.JitsiConnectorFeatureFlagConfiguration>;
					public constructor();
					public isCalendarEnabled(): boolean;
					public setCalendarEnabled(calendarEnabled: boolean): void;
					public isCallIntegrationEnabled(): boolean;
					public setCallIntegrationEnabled(callIntegrationEnabled: boolean): void;
					public isCloseCaptionsEnabled(): boolean;
					public setCloseCaptionsEnabled(closeCaptionsEnabled: boolean): void;
					public isChatEnabled(): boolean;
					public setChatEnabled(chatEnabled: boolean): void;
					public isInviteEnabled(): boolean;
					public setInviteEnabled(inviteEnabled: boolean): void;
					public isIosRecordingEnabled(): boolean;
					public setIosRecordingEnabled(iosRecordingEnabled: boolean): void;
					public isPipEnabled(): boolean;
					public setPipEnabled(pipEnabled: boolean): void;
					public isWelcomePageEnabled(): boolean;
					public setWelcomePageEnabled(welcomePageEnabled: boolean): void;
				}
			}
		}
	}
}

declare module io {
	export module witfy {
		export module jitsiconnector {
			export module config {
				export class JitsiConnectorConfiguration extends java.lang.Object {
					public static class: java.lang.Class<io.witfy.jitsiconnector.config.JitsiConnectorConfiguration>;
					public constructor();
					public isAudioMuted(): boolean;
					public setAudioMuted(audioMuted: boolean): void;
					public isVideoMuted(): boolean;
					public setVideoMuted(videoMuted: boolean);
					public isAudioOnly(): boolean;
					public setAudioOnly(audioOnly: boolean);
					public getFeatureFlags(): io.witfy.jitsiconnector.config.JitsiConnectorFeatureFlagConfiguration;
					public setFeatureFlags(featureFlags: io.witfy.jitsiconnector.config.JitsiConnectorFeatureFlagConfiguration)
				}
			}
		}
	}
}

declare module io {
	export module witfy {
		export module jitsiconnector {
			export class JitsiConnector {
				public static class: java.lang.Class<io.witfy.jitsiconnector.JitsiConnector>;
				public constructor();
				public startVideo(context: android.content.Context, roomName: string);
				public startVideo(
					context: android.content.Context, 
					roomName: string, 
					configuration: io.witfy.jitsiconnector.config.JitsiConnectorConfiguration);
				public setJitsiStateListener(listener: io.witfy.jitsiconnector.JitsiStateListener);
				public finish(): void;
				public leave(): void;
			}
		}
	}
}

declare module io {
	export module witfy {
		export module jitsiconnector {
			export class JitsiConnectorActivity {
				public static class: java.lang.Class<io.witfy.jitsiconnector.JitsiConnectorActivity>;
				public constructor();
				public startVideo(context: android.content.Context, roomName: string);
				public startVideo(
					context: android.content.Context, 
					roomName: string, 
					configuration: io.witfy.jitsiconnector.config.JitsiConnectorConfiguration);
				public getJitsiView(): java.lang.Object<org.jitsi.meet.sdk.JitsiMeetView>;
				public setJitsiStateListener(listener: io.witfy.jitsiconnector.JitsiStateListener);
				public finish(): void;
				public leave(): void;
			}
		}
	}
}

declare module io {
	export module witfy {
		export module jitsiconnector {
			export class JitsiStateListener {
				public static class: java.lang.Class<io.witfy.jitsiconnector.JitsiStateListener>;
				public constructor(implementation: {
					onConferenceStarted(text: string): void;
					onConferenceTerminated(url: string, error: string): void;
					onConferenceWillJoin(url: string): void;
					onConferenceJoined(url: string): void;
				});
				public constructor();
				public onConferenceStarted(text: string): void;
				public onConferenceTerminated(url: string, error: string): void;
				public onConferenceWillJoin(url: string): void;
				public onConferenceJoined(url: string): void;
			}
		}
	}
}
