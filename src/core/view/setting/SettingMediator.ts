// TypeScript file

namespace core.view {

    export class SettingMediator extends core.view.base.Mediator {

        public static NAME: string = "SettingMediator";

        private _settingUI: SettingUI;

        public constructor(viewComponent: any = null) {
            super(core.view.SettingMediator.NAME, viewComponent);
        }

        public listNotificationInterests(): Array<any> {
            return [
                constants.OPEN_SETTING
            ];
        }

        public handleNotification(notification: puremvc.INotification): void {
            switch (notification.getName()) {
                case constants.OPEN_SETTING:
                    this.showUI();
                    break;
            }
        }

        /******************************************************************************************************
        *
        * Abstract methods
        *
        *****************************************************************************************************/

        public onCreateUI(): void {
            this._settingUI = new SettingUI();
            this._settingUI.mBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBack, this);
        }

        public onCreateData(): void {

        }

        public onAddUI(): void {
            core.view.GameLayerManager.getInstance().pushLayer().then((mainLayer) => {
                mainLayer.addChild(this._settingUI);
            });
        }

        public onDestroy(): void {

        }

        /******************************************************************************************************
       *
       * Actions
       *
       *****************************************************************************************************/

        private onClickBack(): void {
            helper.logDescription("點擊返回");
            core.view.GameLayerManager.getInstance().popLayer();
        }

    }
}