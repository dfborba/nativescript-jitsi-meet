import { JitsiMeetConferenceOptions } from './jitsi-meet-options';

export interface JitsiMeet {
    options: JitsiMeetConferenceOptions;
    startMeeting(roomName: string): void;
}
