import { Component, OnInit } from "@angular/core";
import { JitsiMeet } from 'nativescript-jitsi-meet';
import { JitsiMeetConferenceOptions } from 'nativescript-jitsi-meet/jitsi-meet-configuration';

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    public message: string;
    private _roomName: string = '';
    private _jitsiCaller: JitsiMeet;
    constructor() {
        // Use the component constructor to inject providers.
        this.message = 'Hey There';
        
        let options: JitsiMeetConferenceOptions = {
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

        this._jitsiCaller = new JitsiMeet(options);
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    public roomNameChange(args) {
        const textField = args.object;
        this._roomName = textField.text;
    }

    public startVideo() {
        if (!!this._roomName) {
            this._jitsiCaller.startMeeting(this._roomName);
        } else {
            this._jitsiCaller.startMeeting('witfy-2020');
        }
    }
}
