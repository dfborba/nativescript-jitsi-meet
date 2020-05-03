import { NativescriptJitsiMeetConferenceOptions } from "./jitsi-meet.common";
import * as application from "tns-core-modules/application";

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
        console.log(`
        ***> conferenceTerminated
        `);
        
        if (!this._owner) {
            console.log(`
            ***> owner is null
            `);
            return;
        }

        this._owner.get().closeViewController();
        this._owner.get()._callEventListeners('conferenceTerminated', data);
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
    view: JitsiMeetView;

    viewDidAppear(animated: boolean): void {
        super.viewDidAppear(animated);
        console.log(`
        #viewDidAppear
        `);
    }

	viewDidDisappear(animated: boolean): void {
        super.viewDidDisappear(animated);
        console.log(`
        #viewDidDisappear
        `);

        if (!!this.view) {
            console.log(`
            #this.view is not null
            `);
            this.view.leave();
        } else {
            console.log(`
            #this.view is null
            `);

        }
    }

    viewDidUnload(): void {
        console.log(`
        #viewDidUnload
        `);
        super.viewDidUnload();
    }

    viewWillDisappear(animated: boolean): void {
        console.log(`
        #viewWillDisappear ${animated}
        `);
        super.viewWillDisappear(animated);
    }

    removeFromParentViewController(): void {
        console.log(`
        #removeFromParentViewController
        `);
        super.removeFromParentViewController();
    }

    applicationFinishedRestoringState(): void {
        console.log(`
        #applicationFinishedRestoringState
        `);
        super.applicationFinishedRestoringState();
    }

    beginAppearanceTransitionAnimated(isAppearing: boolean, animated: boolean): void {
        console.log(`
        #beginAppearanceTransitionAnimated
        `);

        super.beginAppearanceTransitionAnimated(isAppearing, animated);
    }

    didMoveToParentViewController(parent: UIViewController): void {
        console.log(`
        #didMoveToParentViewController
        `);
        super.didMoveToParentViewController(parent);
    }

    dismissModalViewControllerAnimated(animated: boolean): void {
        console.log(`
        #dismissModalViewControllerAnimated ${animated}
        `);
        super.dismissModalViewControllerAnimated(animated);
    }

    performSegueWithIdentifierSender(identifier: string, sender: any): void {
        console.log(`
        #performSegueWithIdentifierSender ${identifier}
        `);
        super.performSegueWithIdentifierSender(identifier, sender);
    }

    shouldPerformSegueWithIdentifierSender(identifier: string, sender: any): boolean {
        console.log(`
        #shouldPerformSegueWithIdentifierSender ${identifier}
        `);
        return super.shouldPerformSegueWithIdentifierSender(identifier, sender);
    }

    isJitsiMeetRunning(): boolean {
        return false;
    }
}

export class CustomAppDelegate extends UIResponder implements UIApplicationDelegate {
    public static ObjCProtocols = [UIApplicationDelegate];

    private bgTask;
    private timer;
    private timerCounter;

    public applicationPerformFetchWithCompletionHandler(application: UIApplication, completionHandler: any) {
        console.log('App is running in background');
    }

    public applicationDidFailToContinueUserActivityWithTypeError(application: UIApplication, userActivityType: string, error: NSError) {
        console.log('applicationDidFailToContinueUserActivityWithTypeError');
    }
}

export class NativescriptJitsiMeet {
    private _lastScanViewController: UIViewController;
    private _eventListeners: Array<{ event: string, callback: (url: string, error?: string) => void }>;
    private _serverURL: string = '';
    private _jitsiView: JitsiMeetView;

    constructor(serverURL?: string) {
        application.ios.delegate = CustomAppDelegate;
        this._eventListeners = new Array();
        this._serverURL = !!serverURL ? serverURL : 'https://meet.jit.si';
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

        var newViewController = MyUIViewController.new();
        newViewController.modalPresentationStyle = options.fullScreen !== undefined && options.fullScreen
            ? UIModalPresentationStyle.FullScreen : UIModalPresentationStyle.PageSheet;

        this._jitsiView = JitsiMeetView.new();
        this._jitsiView.delegate = MyJitsiMeetViewDelegateImpl.initWithOwner(new WeakRef(this));

        newViewController.view = this._jitsiView;
        
        setTimeout(() => {
            this._jitsiView.join(jitsiMeetOptions);

            const presentViewController = 
                this._getViewControllerToPresentFrom(
                    options.presentInRootVewController !== undefined 
                        ? options.presentInRootVewController : false 
                        );
        
            setTimeout(() => {
                presentViewController.presentViewControllerAnimatedCompletion(newViewController, true, () => {
                    console.log("View has bein presented");
                });
            }, this._isPresentingModally() ? 650 : 0);
        }, 650)
    }

    private _getViewControllerToPresentFrom(presentInRootViewController?: boolean): UIViewController {
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
    
        this._lastScanViewController = viewController;
        return viewController;
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

    public closeViewController() {
        const that = this;
        if (this._lastScanViewController) {
            this._lastScanViewController.dismissViewControllerAnimatedCompletion(true, null);
            this._lastScanViewController = undefined;
        } else {
            this._getViewControllerToPresentFrom().dismissViewControllerAnimatedCompletion(true, null);
        }
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
}
