import { NativescriptJitsiMeetConferenceOptions } from "./jitsi-meet.common";

class MyJitsiMeetViewDelegateImpl extends NSObject implements JitsiMeetViewDelegate {
    public static ObjCProtocols = [JitsiMeetViewDelegate];
    private _owner: WeakRef<any>;
    private _hasJoined: boolean = false;

    public static initWithOwner(owner: WeakRef<any>): MyJitsiMeetViewDelegateImpl {
        let delegate = this.new();
        delegate._owner = owner;
        return delegate;
    }

    static new(): MyJitsiMeetViewDelegateImpl {
        return <MyJitsiMeetViewDelegateImpl>super.new();
    }

    conferenceJoined(data: NSDictionary<string, any>): void {
        this._hasJoined = true;
        if (!this._owner) {
            return;
        }

        this._owner.get()._callEventListeners('conferenceJoined', data);
    }

    conferenceTerminated(data: NSDictionary<string, any>): void {
        if (!this._owner) {
            closeViewController(null);
        } else {
            closeViewController(this._owner.get().lastScanViewController);
            this._owner.get()._callEventListeners('conferenceTerminated', data);
        }
    }

    conferenceWillJoin(data: NSDictionary<string, any>): void {
        if (!this._owner) {
            return;
        }

        this._owner.get()._callEventListeners('conferenceWillJoin', data);
    }

    enterPictureInPicture(data: NSDictionary<string, any>): void {
        if (!this._owner) {
            return;
        }

        this._owner.get()._callEventListeners('enterPictureInPicture', data);
    }
}

class MyUIViewController extends UIViewController {
    delegate: MyJitsiMeetViewDelegateImpl;

    static alloc(): MyUIViewController {
        return <MyUIViewController>super.alloc();
    }

    static new(): MyUIViewController {
        return <MyUIViewController>super.new();
    }

	viewDidDisappear(animated: boolean): void {
        super.viewDidDisappear(animated);
        if (!!this.view) {
            this.getView().leave();
        }
    }

    getView(): JitsiMeetView {
        return this.view as JitsiMeetView;
    }
}

export class NativescriptJitsiMeet {
    private _lastViewController: UIViewController;
    private _currentViewController: MyUIViewController;
    private _eventListeners: Array<{ event: string, callback: (url: string, error?: string) => void }>;
    private _serverURL: string = '';
    private _jitsiView: JitsiMeetView;
    private _jitsiDelegate: MyJitsiMeetViewDelegateImpl;

    constructor(serverURL?: string) {
        this._eventListeners = new Array();
        this._serverURL = !!serverURL ? serverURL : 'https://meet.jit.si';
        this._jitsiView = JitsiMeetView.new();

        this._currentViewController = MyUIViewController.new();
        this._currentViewController.modalPresentationStyle = UIModalPresentationStyle.PageSheet;

        this._currentViewController.view = this._jitsiView;

        const weekRef = new WeakRef(this);
        this._jitsiDelegate = MyJitsiMeetViewDelegateImpl.initWithOwner(weekRef);

        this._currentViewController.getView().delegate = this._jitsiDelegate;
    }

    startMeeting(options: NativescriptJitsiMeetConferenceOptions): void {
        let jitsiMeetOptions = JitsiMeetConferenceOptions.fromBuilder((builder: JitsiMeetConferenceOptionsBuilder) => {
            builder.audioOnly = options.audioOnly;
            builder.videoMuted = options.videoMuted;
            builder.serverURL = new NSURL({ string: this._serverURL });
            builder.room = options.roomName;

            if (!!options.featureFlags) {
                builder.setFeatureFlagWithBoolean('calendar.enabled', 
                    (options.featureFlags.calendarEnabled !== undefined ? options.featureFlags.calendarEnabled : false));
                builder.setFeatureFlagWithBoolean('call-integration.enabled', 
                    (options.featureFlags.callIntegration !== undefined ? options.featureFlags.callIntegration : false));
                builder.setFeatureFlagWithBoolean('close-captions.enabled', 
                    (options.featureFlags.closeCaptionsEnabled !== undefined ? options.featureFlags.closeCaptionsEnabled : false));
                builder.setFeatureFlagWithBoolean('chat.enabled', 
                    (options.featureFlags.chatEnabled !== undefined ? options.featureFlags.chatEnabled : false));
                builder.setFeatureFlagWithBoolean('invite.enabled', 
                    (options.featureFlags.inviteEnabled !== undefined ? options.featureFlags.inviteEnabled : false));
                builder.setFeatureFlagWithBoolean('ios-recording.enabled', 
                    (options.featureFlags.iosRecordingEnabled !== undefined ? options.featureFlags.iosRecordingEnabled : false));
                builder.setFeatureFlagWithBoolean('welcomepage.enabled', 
                    (options.featureFlags.welcomePageEnabled !== undefined ? options.featureFlags.welcomePageEnabled : false));
            } else {
                builder.setFeatureFlagWithBoolean('calendar.enabled', false);
                builder.setFeatureFlagWithBoolean('call-integration.enabled', false);
                builder.setFeatureFlagWithBoolean('close-captions.enabled', false);
                builder.setFeatureFlagWithBoolean('chat.enabled', false);
                builder.setFeatureFlagWithBoolean('invite.enabled', false);
                builder.setFeatureFlagWithBoolean('ios-recording.enabled', false);
                builder.setFeatureFlagWithBoolean('welcomepage.enabled', false);
            }

            if (!!options.userInfo) {
                let userInfo = new JitsiMeetUserInfo();
                userInfo.displayName = options.userInfo.displayName !== undefined ? options.userInfo.displayName : null;
                userInfo.email = options.userInfo.email !== undefined ? options.userInfo.email : null;
                userInfo.avatar = options.userInfo.avatar !== undefined ? new NSURL({ string: options.userInfo.avatar }) : null;
                builder.userInfo = userInfo;
            }
        });

        this._currentViewController.getView().join(jitsiMeetOptions);

        setTimeout(() => {
            this._lastViewController = 
                getViewControllerToPresentFrom(
                    options.presentInRootVewController !== undefined 
                        ? options.presentInRootVewController : false 
                        );

            setTimeout(() => {
                this._lastViewController.presentViewControllerAnimatedCompletion(this._currentViewController, true, null);
            }, this._isPresentingModally() ? 650 : 0);
        }, 650)
    }

    private _isPresentingModally(): boolean {
        let frame = require("tns-core-modules/ui/frame");
        let viewController: UIViewController;
        let topMostFrame = frame.Frame.topmost();

        if (frame.Frame.topmost()) {
            viewController = topMostFrame.currentPage && topMostFrame.currentPage.ios;

            if (viewController) {
                while (viewController.parentViewController) {
                    viewController = viewController.parentViewController;
                }

                return !!viewController.presentedViewController;
            }
        }

        return false;
    }

    stopMeeting(): void {
        if (!!this._jitsiView) {
            this._jitsiView.leave();
        }
    }

    private _callEventListeners(eventName: string, data: NSDictionary<string, any>) {
        const eventListener = this._eventListeners.find(eventListener => eventListener.event === eventName);
        if (!!eventListener) {
            const url = data.objectForKey('url');
            const error = data.objectForKey('error');

            eventListener.callback(url, error ? error : null);
        }
    }

    on(eventName: string, callback: (url: string, error?: string) => void) {
        if (eventName === 'conferenceWillJoin'
                || eventName === 'conferenceJoined'
                    || eventName === 'conferenceTerminated'
                        || eventName === 'enterPictureInPicture') {
            if (!this._eventListeners.find(eventListener => eventListener.event === eventName)) {
                this._eventListeners.push({ event: eventName, callback: callback });
            }
        }
    }

    addEventListener(event: string, callback: (url: string, error?: string) => void) {
        this.on(event, callback);
    }

    get lastScanViewController() {
        return this._lastViewController;
    }
}

function getViewControllerToPresentFrom(presentInRootViewController?: boolean): UIViewController {
    let frame = require("tns-core-modules/ui/frame");
    let viewController: UIViewController;
    let topMostFrame = frame.Frame.topmost();

    if (topMostFrame && presentInRootViewController !== true) {
        viewController = topMostFrame.currentPage && topMostFrame.currentPage.ios;

        if (viewController) {
            while (viewController.parentViewController) {
                // find top-most view controler
                viewController = viewController.parentViewController;
            }

            while (viewController.presentedViewController) {
                // find last presented modal
                viewController = viewController.presentedViewController;
            }
        }
    }

    if (!viewController) {
        viewController = UIApplication.sharedApplication.keyWindow.rootViewController;
    }

    return viewController;
}

function closeViewController(lastScanViewController: UIViewController): void {
    if (lastScanViewController) {
        lastScanViewController.dismissViewControllerAnimatedCompletion(true, null);
        lastScanViewController = undefined;
    } else {
        getViewControllerToPresentFrom().dismissViewControllerAnimatedCompletion(true, null);
    }
}