# nativescript-jitsi-meet

**This plugin is on a very early version.**

**As soon as the code improves I'll be updating the README as well.**  :wink:

I'll keep improving this plugin as the time pass, if you want to know which are the next features I'll be working take a look below. 

## I'm working on
- Add call listeners to Android such as conferenceTerminated and etc.
- Android is not accepting custom jitsi server yet, only IOS.
- Add core demo version
- Test and add Vue demo verion

- In the future I'd like to have more control of jitsi features such as hide invitation button, start call with password and etc. But so far I haven't found if Jisti already have this available on they framework and sdk.

## Prerequisites / Requirements

The only requisits I found necessary so far is that you application my use android:minSdkVersion 21;

## Installation

tns plugin add nativescript-jitsi-meet

## Android

-

## IOS

In your info.plist file add the follow lines:

```xml
...

    <key>NSCameraUsageDescription</key>
    <string>Can we use your camera?</string>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>Can we use your photo library, please? :)</string>
    <key>NSCalendarsUsageDescription</key>
    <string>Give access to your calendar to improve your conference experience</string>
    <key>UIBackgroundModes</key>
    <array>
      <string>audio</string>
      <string>voip</string>
    </array>
    <key>UIViewControllerBasedStatusBarAppearance</key>
    <string>NO</string>

...
```

## Angular Usage 
```typescript
import { NativescriptJitsiMeetConferenceOptions, NativescriptJitsiMeet } from 'nativescript-jitsi-meet';

...

public startMeet() {
    const jitsiOptions: NativescriptJitsiMeetConferenceOptions = {
            roomName: 'test',  // the only mandatory field
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
                welcomePageEnabled: true
            }
    };
    
    const jitsiCaller: NativescriptJitsiMeet = new NativescriptJitsiMeet();
    
    jitsiCaller.on('conferenceWillJoin', (url: string, error: string) => {
        console.log(`conferenceWillJoin`);
    });

    jitsiCaller.on('conferenceJoined', (url: string, error: string) => {
        console.log(`conferenceJoined`);
    });

    jitsiCaller.on('conferenceTerminated', (url: string, error: string) => {
        console.log(`conferenceTerminated`);
    });
    
    // this function will start your meeting;
    jitsiCaller.startMeeting(this.jitsiOptions);
}

...

```

## API

By default the server https://meet.jit.si/ is the default server used by this plugin but you have your own jitsi server you can pass the path on the constructor of NativescriptJitsiMeet.

**startMeeting**
This function will recebei as parameter your options and will start the meet;

## Jitsi configuration
    
| Property | Default | Description |
| --- | --- | --- |
| roomName |  string, only mandatory property | your room name, keep in mind that if you use this plugin if jitsi default server your room will be always public at the start |
| audioMuted | false | start the meet with the audio muted |
| videoMuted | false | start the meet with the video muted |
| audioOnly | false | start the meet with audio only |
| featureFlags | object | some jitsi meet configuration flags |

| Feature flags property | Default | Description |
| --- | --- | --- |
| closeCaptionsEnabled | false | active close caption |
| calendarEnabled | false | ??active calendar |
| callIntegration | false | ??start meet call with call integration |
| chatEnabled | false | start meet with chat enable |
| iosRecordingEnabled | false | enable ios recording video |
| pipEnabled | false | enable pip features |
| welcomePageEnabled | false | enables the jitsi server welcome page, which is not being in use right now because everytime the user close the call we close the view, so this will not be shown by now |

## Events (Only IOS for now)

**conferenceWillJoin**

First event fired before actualy join the meet;

**conferenceJoined**

Event fired when user actualy join the meet;

**conferenceTerminated**

Event fired when call is terminated;

## License

Apache License Version 2.0, January 2004
