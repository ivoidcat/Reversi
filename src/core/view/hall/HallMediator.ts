// TypeScript file

namespace core.view {

    export class HallMediator extends core.view.base.Mediator {

        public static NAME: string = "HallMediator";

        private _hallUI: HallUI;

        public constructor(viewComponent: any = null) {
            super(core.view.HallMediator.NAME, viewComponent);
        }

        public listNotificationInterests(): Array<any> {
            return [
                constants.OPEN_HALL
            ];
        }

        public handleNotification(notification: puremvc.INotification): void {
            switch (notification.getName()) {
                case constants.OPEN_HALL:
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
            this._hallUI = new HallUI();
            this._hallUI.mDoublePlayerBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickDouble, this);
            this._hallUI.mSinglePlayerBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickSingle, this);
            this._hallUI.mSettingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickSetting, this);
        }

        public onCreateData(): void {

        }

        public onAddUI(): void {
            GameLayerManager.getInstance().pushLayer().then((mainLayer) => {
                mainLayer.addChild(this._hallUI);
            });
        }

        public onDestroy(): void {

        }

        /******************************************************************************************************
       *
       * Actions
       *
       *****************************************************************************************************/

        private onClickSingle(): void {
            helper.logDescription("點擊單人");
        }

        private onClickDouble(): void {
            helper.logDescription("點擊雙人");
            AppFacade.getInstance().sendNotification(constants.OPEN_ROOM);
        }

        private onClickSetting(): void {
            helper.logDescription("點擊設定");
            AppFacade.getInstance().sendNotification(constants.OPEN_SETTING);
        }
    }
}