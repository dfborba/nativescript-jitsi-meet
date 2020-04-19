/// <reference path="android-declarations.d.ts"/>

declare module io {
	export module witfy {
		export module jitsiconnector {
			export class JitsiConnector {
				public startVideo(context: globalAndroid.content.Context, roomName: string);
			}
		}
	}
}