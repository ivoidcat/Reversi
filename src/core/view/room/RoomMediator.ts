// TypeScript file

namespace core.view {

    export class RoomMediator extends core.view.base.Mediator {

        public static NAME: string = "RoomMediator";

        private _roomsUI: RoomsUI;

        public constructor(viewComponent: any = null) {
            super(core.view.RoomMediator.NAME, viewComponent);
        }

        public listNotificationInterests(): Array<any> {
            return [
                constants.OPEN_ROOM
            ];
        }

        public handleNotification(notification: puremvc.INotification): void {
            switch (notification.getName()) {
                case constants.OPEN_ROOM:
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
            this._roomsUI = new RoomsUI();
            this._roomsUI.mBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBack, this);
            this._roomsUI.mList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickRoom, this);  
        }

        public onCreateData(): void {

        }

        public onAddUI(): void {
            core.view.GameLayerManager.getInstance().pushLayer().then((mainLayer) => {
                mainLayer.addChild(this._roomsUI);
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

        private onClickRoom(e: eui.ItemTapEvent): void {
            helper.logDescription(`當前點擊第, ${e.itemIndex} 個房間`);
            AppFacade.getInstance().sendNotification(constants.OPEN_GAME);
        }
    }
}