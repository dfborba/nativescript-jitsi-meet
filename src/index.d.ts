import { JitsiMeetConferenceOptions } from './jitsi-meet-configuration';

export declare class JitsiMeet {
  constructor(o?: JitsiMeetConferenceOptions);
  startMeeting(roomName: string);
}
