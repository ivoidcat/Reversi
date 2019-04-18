// TypeScript file


// TypeScript file

namespace core.view {

    export class GameMediator extends core.view.base.Mediator {

        public static NAME: string = "GameMediator";

        private _gameUI: GameUI;

        public constructor(viewComponent: any = null) {
            super(core.view.GameMediator.NAME, viewComponent);
        }

        public listNotificationInterests(): Array<any> {
            return [
                constants.OPEN_GAME
            ];
        }

        public handleNotification(notification: puremvc.INotification): void {
            switch (notification.getName()) {
                case constants.OPEN_GAME:
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
            this._gameUI = new GameUI();
            this._gameUI.mBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBack, this);
            this._gameUI.mGameBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickPlaceDisc, this);
        }

        public onCreateData(): void {

        }

        public onAddUI(): void {
             core.view.GameLayerManager.getInstance().pushLayer().then((mainLayer) => {
                mainLayer.addChild(this._gameUI);
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

        private onClickPlaceDisc(e: egret.TouchEvent): void  {

            if (this._gameUI.getGameStatus() == Status.black || this._gameUI.getGameStatus() == Status.white) {
                helper.logDescription("點擊下棋");
            }
       
            this._gameUI.setPlaceChess(e.localX, e.localY);
        }
    }
}