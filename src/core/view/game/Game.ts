// TypeScript file


module constants {

	export let SIZE_CELL: number = 80;

	export let SIZE_CHESS: number = 70;

	export let LINE_WIDTH: number = 3;

	export let LINE_COLOR: number = 0x000000;

}

module core.view {

	export class GameStatus {

		public empty: number = 64;

		public black: number = 0;

		public white: number = 0;

		public placed: number = 0;

		public status: Status = Status.none;

		constructor() { }

		public setPlaceDisc(): void {

		}
	}

	export class Chess {

		public x: number = 0;

		public y: number = 0;

		public image: egret.Bitmap = new egret.Bitmap();

		private _imageStatus: ImageStatus = ImageStatus.none;

		constructor(x: number, y: number, imageStatus: ImageStatus = ImageStatus.none) {
			this.x = x;
			this.y = y
			this._imageStatus = imageStatus;
			this.setImage(imageStatus);
		}

		public getImage(): egret.Bitmap {
			this.image.x = this.x;
			this.image.y = this.y;
			this.image.width = constants.SIZE_CHESS;
			this.image.height = constants.SIZE_CHESS;
			return this.image;
		}

		public setImage(imageStatus: ImageStatus): void {
			let imageName = ""
			this._imageStatus = imageStatus;
			switch (imageStatus) {
				case ImageStatus.white:
					imageName = "white1_png";
					break;
				case ImageStatus.black:
					imageName = "black1_png";
					break;
			}
			this.image = utility.createBitmapByName(imageName);
		}

		public getImageStatus(): ImageStatus {
			return this._imageStatus;
		}
	}

	export class Player {

		private _imageStatus: ImageStatus = 0;

		private _playerStatus: PlayerStatus = PlayerStatus.none;

		private _name: string = "";

		constructor(imageStatus: ImageStatus, name: string) {
			this._imageStatus = imageStatus;
			this._name = name;
		}

		public setPlayerStatus(sender: PlayerStatus) {
			this._playerStatus = sender;
		}

		public getPlayerStatus(): PlayerStatus {
			return this._playerStatus;
		}

		public getImageStatus(): ImageStatus {
			return this._imageStatus;
		}

		public getName(): string {
			return this._name;
		}

		public getChessColorName(): string {
			switch (this._imageStatus) {
				case ImageStatus.white:
					return "白"
				case ImageStatus.black:
					return "黑"
			}
		}
	}

	export enum Status {
		prepare,

		start,

		black,

		white,

		watch,

		end,

		none
	}

	export enum ImageStatus {
		white,
		black,
		none
	}

	export enum PlayerStatus {
		canPlace,
		canNotPlace,
		watch,
		none
	}
}

