import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { EventData } from "tns-core-modules/ui/page/page";
import { Switch } from "tns-core-modules/ui/switch";
import { NativescriptJitsiMeetConferenceOptions, NativescriptJitsiMeet } from "../../../../src";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    public message: string;
    private _roomName: string = '';
    private _serverName: string = '';
    private _jitsiCaller: NativescriptJitsiMeet;
    public jitsiOptions: NativescriptJitsiMeetConferenceOptions;
    public jitsiEventLog: string;

    constructor(private _changeDetectionRef: ChangeDetectorRef) {
        this.jitsiEventLog = '> Log initialized \n\n';
        
        this.jitsiOptions = {
            roomName: '',
            audioMuted: false,
            videoMuted: false,
            audioOnly: false,
            featureFlags: {
                closeCaptionsEnabled: false,
                calendarEnabled: false,
                callIntegration: false,
                chatEnabled: false,
                inviteEnabled: false,
                iosRecordingEnabled: false,
                pipEnabled: false,
                welcomePageEnabled: false
            },
            userInfo: {
                displayName: 'Daniel Borba'
            }
        };
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    public roomNameChange(args) {
        const textField = args.object;
        this._roomName = textField.text;
    }

    public serverNameChange(args) {
        const textField = args.object;
        this._serverName = textField.text;
    }

    public startMeet() {
        this._jitsiCaller = new NativescriptJitsiMeet(this._serverName);

        this._jitsiCaller.on('conferenceWillJoin', (url: string, error: string) => {
            this.jitsiEventLog += '>> *conferenceWillJoin* ' + url + ' \n';
            this._changeDetectionRef.detectChanges();
        });

        this._jitsiCaller.on('conferenceJoined', (url: string, error: string) => {
            this.jitsiEventLog += '>> *conferenceJoined* ' + url + ' \n';
            this._changeDetectionRef.detectChanges();
        });

        this._jitsiCaller.on('conferenceTerminated', (url: string, error: string) => {
            this.jitsiEventLog += '>> *conferenceTerminated* ' + url + ' \n';
            this._changeDetectionRef.detectChanges();
        });

        this._jitsiCaller.on('enterPictureInPicture', (url: string, error: string) => {
            this.jitsiEventLog += '>> *enterPictureInPicture* ' + url + ' \n';
            this._changeDetectionRef.detectChanges();
        });

        if (!!this._roomName) {
            this.jitsiOptions.roomName = this._roomName;
        } else {
            this.jitsiOptions.roomName = 'witfy-2020-test';
        }

        this._jitsiCaller.startMeeting(this.jitsiOptions);
    }

    public audioMuted(args: EventData) {
        let sw = args.object as Switch;
        this.jitsiOptions.audioMuted = sw.checked;
    }

    public videoMuted(args: EventData) {
        let sw = args.object as Switch;
        this.jitsiOptions.videoMuted = sw.checked;
    }

    public audioOnly(args: EventData) {
        let sw = args.object as Switch;
        this.jitsiOptions.audioOnly = sw.checked;
    }

    public inviteEnabled(args: EventData) {
        let sw = args.object as Switch;
        this.jitsiOptions.featureFlags.inviteEnabled = sw.checked;
    }

    public closeCaptionsEnabled(args: EventData) {
        let sw = args.object as Switch;
        this.jitsiOptions.featureFlags.closeCaptionsEnabled = sw.checked;
    }

    public calendarEnabled(args: EventData) {
        let sw = args.object as Switch;
        this.jitsiOptions.featureFlags.calendarEnabled = sw.checked;
    }

    public callIntegration(args: EventData) {
        let sw = args.object as Switch;
        this.jitsiOptions.featureFlags.callIntegration = sw.checked;
    }

    public chatEnabled(args: EventData) {
        let sw = args.object as Switch;
        this.jitsiOptions.featureFlags.chatEnabled = sw.checked;
    }

    public iosRecordingEnabled(args: EventData) {
        let sw = args.object as Switch;
        this.jitsiOptions.featureFlags.iosRecordingEnabled = sw.checked;
    }

    public pipEnabled(args: EventData) {
        let sw = args.object as Switch;
        this.jitsiOptions.featureFlags.pipEnabled = sw.checked;
    }

    public welcomePageEnabled(args: EventData) {
        let sw = args.object as Switch;
        this.jitsiOptions.featureFlags.welcomePageEnabled = sw.checked;
    }

    public showUserInfo(args: EventData) {
        let sw = args.object as Switch;
        if (sw.checked) {
            this.jitsiOptions.userInfo = {
                displayName: 'Person Who?',
                email: 'personwho@what.really',
                avatar: 'http://www.sfu.ca/~cqt/IAT352/a4/img/avatars/test-user.png'
            }
        } else {
            this.jitsiOptions.userInfo = undefined;
        }
    }
}
