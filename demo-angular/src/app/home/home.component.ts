import { Component, OnInit } from "@angular/core";
import { JitsiMeet } from 'nativescript-jitsi-meet';
import { JitsiMeetConferenceOptions } from 'nativescript-jitsi-meet/jitsi-meet-configuration';
import { EventData } from "tns-core-modules/ui/page/page";
import { Switch } from "tns-core-modules/ui/switch";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    public message: string;
    private _roomName: string = '';
    private _jitsiCaller: JitsiMeet;
    public jitsiOptions: JitsiMeetConferenceOptions;
    constructor() {
        // Use the component constructor to inject providers.
        this.message = 'Hey There';
        
        this.jitsiOptions = {
            audioMuted: false,
            videoMuted: false,
            audioOnly: false,
            featureFlags: {
                calendarEnabled: false,
                callIntegration: false,
                chatEnabled: false,
                inviteEnabled: false,
                iosRecordingEnabled: false,
                pipEnabled: false,
                welcomePageEnabled: true
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

    public startVideo() {
        this._jitsiCaller = new JitsiMeet(this.jitsiOptions);

        if (!!this._roomName) {
            this._jitsiCaller.startMeeting(this._roomName);
        } else {
            this._jitsiCaller.startMeeting('witfy-2020');
        }
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
}
