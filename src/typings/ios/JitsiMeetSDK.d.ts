interface JitsiMeetViewDelegate extends NSObjectProtocol {
    conferenceTerminated?(data: NSDictionary): void;
    conferenceWillJoin?(data: NSDictionary): void;
    conferenceJoined?(data: NSDictionary): void;
    enterPictureInPicture?(data: NSDictionary): void;
}

declare var JitsiMeetViewDelegate: {
    prototype: JitsiMeetViewDelegate;
}

declare class JitsiMeetUserInfo extends NSObject {
    static alloc(): JitsiMeetUserInfo;
    static new(): JitsiMeetUserInfo;

    displayName: string;
    email: string;
    avatar: NSURL;
}

declare class JitsiMeetConferenceOptionsBuilder extends NSObject {
    static alloc(): JitsiMeetConferenceOptionsBuilder;
    static new(): JitsiMeetConferenceOptionsBuilder;
    static init(): this;

    serverURL: NSURL;
    room: string;
    subject: string;
    token: string
    colorSchema: NSDictionary;
    featureFlags: NSDictionary;
    audioOnly: boolean;
    videoMuted: boolean;
    welcomePageEnabled: boolean;
    userInfo: JitsiMeetUserInfo;
    
    public setFeatureFlagWithBoolean(flag: string, value: boolean);
    public setFeatureFlagWithValue(flag: string, value: any);
}

declare class JitsiMeetConferenceOptions extends NSObject {
    static alloc(): JitsiMeetConferenceOptions;
    static new(): JitsiMeetConferenceOptions;
    static init(): this;

    readonly serverURL: NSURL;
    readonly room: string;
    readonly subject: string;
    readonly token: string
    readonly colorSchema: NSDictionary;
    readonly featureFlags: NSDictionary;
    readonly audioOnly: boolean;
    readonly videoMuted: boolean;
    readonly welcomePageEnabled: boolean;
    readonly userInfo: JitsiMeetUserInfo;
    
    static fromBuilder(initBlock: Function): JitsiMeetConferenceOptions;
}

declare class JitsiMeetView extends UIView {
    static alloc(): JitsiMeetView;
    static new(): JitsiMeetView;

    delegate: JitsiMeetViewDelegate;
    join(options: JitsiMeetConferenceOptions): void;
    leave(): void;
}