
import { JitsiMeetConferenceOptions } from "./jitsi-meet-options";
import { JitsiMeet } from "./jitsi-meet.common";

class MyJitsiMeetViewDelegateImpl extends NSObject implements JitsiMeetViewDelegate {
    public static ObjCProtocols = [JitsiMeetViewDelegate];
    private _owner: WeakRef<any>;

    public static initWithOwner(owner: WeakRef<any>): MyJitsiMeetViewDelegateImpl {
        let delegate = this.new();
        delegate._owner = owner;
        return delegate;
    }

    static new(): MyJitsiMeetViewDelegateImpl {
        return <MyJitsiMeetViewDelegateImpl>super.new();
    }

    private _callback: (data: NSDictionary<string, any>) => void; 

    setCallback(toCall: (data: NSDictionary<string, any>) => void): void {
        this._callback = toCall; 
    }

    conferenceJoined(data: NSDictionary<string, any>): void {
        console.log('conferenceJoined');
        this._callback(data);
    }

    conferenceTerminated(data: NSDictionary<string, any>): void {
        console.log('conferenceTerminated');
        this._callback(data);
        this._owner.get()._closeViewController();
    }

    conferenceWillJoin(data: NSDictionary<string, any>): void {
        this._callback(data);
        console.log('conferenceWillJoin');
    }

    enterPictureInPicture(data: NSDictionary<string, any>): void {
        this._callback(data);
        console.log('enterPictureInPicture');
    }
}

export class JitsiMeetImpl implements JitsiMeet {
    private _options: JitsiMeetConferenceOptions;
    private _lastScanViewController: UIViewController;

    constructor(o: JitsiMeetConferenceOptions) {
        
    }

    startMeeting(roomName: string): void {
        let jitsiMeetOptions = JitsiMeetConferenceOptions.fromBuilder((builder: JitsiMeetConferenceOptionsBuilder) => {
            builder.audioOnly = false;
            builder.videoMuted = false;
            builder.serverURL = new NSURL({ string: 'https://meet.jit.si' });
            builder.room = 'witfy-2020';
        });

        var newViewController = UIViewController.new();
        
        const that = this;
        let delegate = MyJitsiMeetViewDelegateImpl.initWithOwner(new WeakRef(this));
        delegate.setCallback((data: NSDictionary<string, any>) => {
            console.log('view delegate call back has being called');
        });
            
        let jitsiView: JitsiMeetView = JitsiMeetView.new();
        newViewController.view = jitsiView;
        jitsiView.delegate = delegate;

        jitsiView.join(jitsiMeetOptions);
        this._getViewControllerToPresentFrom().presentViewControllerAnimatedCompletion(newViewController, true, () => {});
    }

    get options(): JitsiMeetConferenceOptions {
        return this._options;
    }

    set options(options: JitsiMeetConferenceOptions) {
        this._options = options;
    }

    private _getViewControllerToPresentFrom(presentInRootViewController?: boolean): UIViewController {
        let frame = require("tns-core-modules/ui/frame");
        let viewController: UIViewController;
        let topMostFrame = frame.topmost();
    
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

    private _closeViewController() {
        if (this._lastScanViewController) {
            this._lastScanViewController.dismissViewControllerAnimatedCompletion(true, null);
            this._lastScanViewController = undefined;
        }
    }
}
