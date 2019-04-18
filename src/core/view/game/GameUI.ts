

module core.view {

	export class GameUI extends eui.Component implements eui.UIComponent {

		private _isCompleteLoadSkin: boolean = false;

		public mBack: eui.Button;

		public mPlayer1: eui.Label;

		public mPlayer2: eui.Label;

		public mGameBg: eui.Group;

		public mCurrentPlayer: eui.Label;

		private _gameStatus = new core.view.GameStatus();

		private _chesses: Array<core.view.Chess> = [];

		private _chessesCache: Array<core.view.Chess> = [];

		private _player1: core.view.Player;

		private _player2: core.view.Player;

		private _currentPlayer: core.view.Player;



		public constructor() {
			super();
			this.addEventListener(eui.UIEvent.COMPLETE, this.omComplete, this);
			this.skinName = "skins.GameUISkin";
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		private omComplete(): void {
			helper.logDescription("GameUI complete load skin");
			this._isCompleteLoadSkin = true;
			this.removeEventListener(eui.UIEvent.COMPLETE, this.omComplete, this);
			this.prepare();
		}

		private prepare(): void {
			this.setGameStatus(Status.prepare);
			this.setBgGrid();
			this.initChess();
			this.initPlayersChess();
			this.initPlayer();
		}

		private start(): void {
			this.setGameStatus(Status.start);
		}

		/******************************************************************************************************
		*
		* Public
		* 
		*****************************************************************************************************/

		public getGameStatus(): Status {
			return this._gameStatus.status;
		}

		public setPlaceChess(x: number, y: number) {

			let column = (x / constants.SIZE_CELL | 0);
			let row = (y / constants.SIZE_CELL | 0);

			if (this.canPlaceChess({ column: column, row: row }) == true) {
				this.placeChess({ column: column, row: row }, this._currentPlayer.getImageStatus());
				this.placeInfectedChess();
				this.changePlayer();
			}
		}

		/******************************************************************************************************
		*
		* Logic Helper
		* 
		*****************************************************************************************************/

		/**
  		* 初始化棋盤所有 chess
  		*/
		private initChess(): void {
			let xCoordinate = (constants.SIZE_CELL - constants.SIZE_CHESS) / 2;
			let yCoordinate = (constants.SIZE_CELL - constants.SIZE_CHESS) / 2;

			for (var i = 0; i < 8; i++) {
				let tempY = yCoordinate + i * constants.SIZE_CELL;
				for (var j = 0; j < 8; j++) {
					let tempX = xCoordinate + j * constants.SIZE_CELL;
					let chess: Chess = new Chess(tempX, tempY);
					this._chesses.push(chess);
					this.mGameBg.addChild(chess.getImage());
				}
			}
		}

		/**
		  * 初始化中間的 chess
		  */
		private initPlayersChess(): void {
			this.placeChess({ column: 3, row: 3 }, ImageStatus.black);
			this.placeChess({ column: 4, row: 4 }, ImageStatus.black);
			this.placeChess({ column: 3, row: 4 }, ImageStatus.white);
			this.placeChess({ column: 4, row: 3 }, ImageStatus.white);
		}

		/**
		  * 初始化玩家
		  */
		private initPlayer(): void {
			this._player1 = new core.view.Player(ImageStatus.black, "AAA");
			this._player2 = new core.view.Player(ImageStatus.white, "BBB");
			this._currentPlayer = this._player1;
		}

		/**	
		  * 玩家互換
		  */
		private changePlayer(): void {
			this._currentPlayer = (this._currentPlayer == this._player1) ? this._player2 : this._player1;
			this.mCurrentPlayer.text = `當前是 ${this._currentPlayer.getChessColorName()}`
		}

		/**
		  * 是否可以下 
		  * martix {I.Matrix} 矩陣位置
		  */
		private canPlaceChess(martix: I.Matrix): boolean {

			if (this._chesses[this.convertToIndex(martix)].getImageStatus() != ImageStatus.none) {
				helper.logDescription(`當前 Cell 是空的`);
				return false
			}

			let column = martix.column;
			let row = martix.row;
			let indexOfChess = this.convertToIndex(martix);
			let isNeedInfected: boolean = false;
			let _cache: Array<core.view.Chess> = []

			helper.logDescription(`點擊第 ${column} 個 column, 第 ${row} 個 row，index 是 ${indexOfChess}`);

			/// ---------------- 往上
			if (indexOfChess > 7) {

				isNeedInfected = false;
				_cache = []

				for (var index = row - 1; index >= 0; index--) {
					helper.logDescription(`往上 index = ${index}`);
					let chess = this.getChess({ column: column, row: index });

					if (chess.getImageStatus() == ImageStatus.none) {
						break;
					} else if (chess.getImageStatus() == this._currentPlayer.getImageStatus()) {
						isNeedInfected = true;
						break;
					} else {
						_cache.push(chess);
					}
				}
				this.putInfectedChessIntoCacheArray(_cache, isNeedInfected);
			}

			/// ---------------- 往下
			if (indexOfChess < 56) {

				isNeedInfected = false;
				_cache = []

				for (var index = row + 1; index < 8; index++) {
					helper.logDescription(`往下 index = ${index}`);
					let chess = this.getChess({ column: column, row: index });

					if (chess.getImageStatus() == ImageStatus.none) {
						break;
					} else if (chess.getImageStatus() == this._currentPlayer.getImageStatus()) {
						isNeedInfected = true;
						break;
					} else {
						_cache.push(chess);
					}
				}

				this.putInfectedChessIntoCacheArray(_cache, isNeedInfected);
			}

			if ((indexOfChess + 1) % 8 != 0) {

				/// ---------------- 往右
				isNeedInfected = false;
				_cache = [];

				for (var index = column + 1; index < 8; index++) {
					helper.logDescription(`往右 index = ${index}`);
					let chess = this.getChess({ column: index, row: row });

					if (chess.getImageStatus() == ImageStatus.none) {
						break;
					} else if (chess.getImageStatus() == this._currentPlayer.getImageStatus()) {
						isNeedInfected = true;
						break;
					} else {
						_cache.push(chess);
					}
				}
				this.putInfectedChessIntoCacheArray(_cache, isNeedInfected);

				/// ---------------- 往右上

				if (indexOfChess > 8) {
					isNeedInfected = false;
					_cache = [];

					for (var tempRow = row - 1, tempColumn = column + 1; tempRow >= 0 && tempColumn < 8; tempRow-- , tempColumn++) {
						helper.logDescription(`往右上 column = ${tempColumn}, row = ${tempRow}`);
						let chess = this.getChess({ column: tempColumn, row: tempRow });

						if (chess.getImageStatus() == ImageStatus.none) {
							break;
						} else if (chess.getImageStatus() == this._currentPlayer.getImageStatus()) {
							isNeedInfected = true;
							break;
						} else {
							_cache.push(chess);
						}
					}

					this.putInfectedChessIntoCacheArray(_cache, isNeedInfected);
				}

				/// ---------------- 往右下
				if (indexOfChess < 56) {

					isNeedInfected = false;
					_cache = [];

					for (var tempRow = row + 1, tempColumn = column + 1; (tempRow < 8 && tempColumn < 8); tempRow++ , tempColumn++) {

						helper.logDescription(`往右下 column = ${tempColumn}, row = ${tempRow}`);
						let chess = this.getChess({ column: tempColumn, row: tempRow });

						if (chess.getImageStatus() == ImageStatus.none) {
							break;
						} else if (chess.getImageStatus() == this._currentPlayer.getImageStatus()) {
							isNeedInfected = true;
							break;
						} else {
							_cache.push(chess);
						}
					}

					this.putInfectedChessIntoCacheArray(_cache, isNeedInfected);
				}
			}

			if (indexOfChess % 8 != 0) {


				/// ---------------- 往左
				isNeedInfected = false;
				_cache = []

				for (var index = column - 1; index >= 0; index--) {
					helper.logDescription(`往左 index = ${index}`);
					let chess = this.getChess({ column: index, row: row });

					if (chess.getImageStatus() == ImageStatus.none) {
						break;
					} else if (chess.getImageStatus() == this._currentPlayer.getImageStatus()) {
						isNeedInfected = true;
						break;
					} else {
						_cache.push(chess);
					}
				}

				this.putInfectedChessIntoCacheArray(_cache, isNeedInfected);

				/// ---------------- 往左下
				if (indexOfChess < 56) {
					isNeedInfected = false;
					_cache = [];

					for (var tempRow = row + 1, tempColumn = column - 1; tempRow < 8 && tempColumn > 0; tempRow++ , tempColumn--) {
						helper.logDescription(`往左下 column = ${tempColumn}, row = ${tempRow}`);
						let chess = this.getChess({ column: tempColumn, row: tempRow });

						if (chess.getImageStatus() == ImageStatus.none) {
							break;
						} else if (chess.getImageStatus() == this._currentPlayer.getImageStatus()) {
							isNeedInfected = true;
							break;
						} else {
							_cache.push(chess);
						}
					}

					this.putInfectedChessIntoCacheArray(_cache, isNeedInfected);
				}

				/// ---------------- 往左上
				if (indexOfChess > 8) {
					isNeedInfected = false;
					_cache = [];

					for (var tempRow = row - 1, tempColumn = column - 1; tempRow >= 0 && tempColumn > 0; tempRow-- , tempColumn--) {
						helper.logDescription(`往左上 column = ${tempColumn}, row = ${tempRow}`);
						let chess = this.getChess({ column: tempColumn, row: tempRow });

						if (chess.getImageStatus() == ImageStatus.none) {
							break;
						} else if (chess.getImageStatus() == this._currentPlayer.getImageStatus()) {
							isNeedInfected = true;
							break;
						} else {
							_cache.push(chess);
						}
					}

					this.putInfectedChessIntoCacheArray(_cache, isNeedInfected);
				}
			}

			return (this._chessesCache.length == 0) ? false : true;
		}

		/**
		  * 把受感染的 chess 放到 cache array 裡面，等下準備做變化
		  * cache {Array<core.view.Chess>} 那些受感染的棋子
		  * isNeedInfected {boolean} 是否需要被感染
		  */
		private putInfectedChessIntoCacheArray(cache: Array<core.view.Chess>, isNeedInfected: boolean): void {
			if (isNeedInfected == false) { cache = []; }
			cache.forEach(chess => {
				this._chessesCache.push(chess)
			});
		}

		/**
		  * 畫背景格子
		  */
		private setBgGrid(): void {

			let size = constants.SIZE_CELL * 8;

			for (var index = 0; index < 9; index++) {
				var shp: egret.Shape = new egret.Shape();
				shp.touchEnabled = false;
				shp.graphics.lineStyle(constants.LINE_WIDTH, constants.LINE_COLOR);
				shp.graphics.moveTo(0, index * constants.SIZE_CELL);
				shp.graphics.lineTo(size, index * constants.SIZE_CELL);
				this.mGameBg.addChild(shp);
			}

			for (var index = 0; index < 9; index++) {
				var shp: egret.Shape = new egret.Shape();
				shp.touchEnabled = false;
				shp.graphics.lineStyle(constants.LINE_WIDTH, constants.LINE_COLOR);
				shp.graphics.moveTo(index * constants.SIZE_CELL, 0);
				shp.graphics.lineTo(index * constants.SIZE_CELL, size);
				this.mGameBg.addChild(shp);
			}
		}

		/**
		  * 下棋
		  * martix {I.Matrix} 棋子的矩陣位置
		  * imageStatus {core.view.ImageStatus} 棋子當前的圖片
		  */
		private placeChess(martix: I.Matrix, imageStatus: core.view.ImageStatus): void {
			let chess = this.getChess(martix);
			chess.setImage(imageStatus)
			this.mGameBg.addChild(chess.getImage());
			this._chesses[this.convertToIndex(martix)] = chess;
			this.setGameStatusAmount(imageStatus);
		}

		/** 
		  * 替換掉那些被感染的棋子
		  */
		private placeInfectedChess(): void {
			this._chessesCache.forEach(chess => {
				chess.setImage(this._currentPlayer.getImageStatus());
				this.mGameBg.addChild(chess.getImage());
			});
			this._chessesCache = []
		}

		/**
		  * 轉換成 array 要用的 index 
		  * martix {I.Matrix} 矩陣
		  */
		private convertToIndex(martix: I.Matrix): number {
			return martix.column + martix.row * 8;
		}

		/**
		  * 得到當前的 chess
		  * martix {I.Matrix} 矩陣
		  */
		private getChess(martix: I.Matrix): Chess {
			return this._chesses[this.convertToIndex(martix)];
		}

		/**
	  	  * 得到當前的 chess
	 	  * index {number} index 
	  	  */
		private getChessAtIndex(index: number): Chess {
			return this._chesses[index + 1];
		}

		/**
		  * 設置遊戲的狀態
		  * status {Status} 狀態
		  */
		private setGameStatus(status: Status): void {
			this._gameStatus.status = status;
		}

		/**
		  * 設置遊戲的黑白棋狀態的數量
		  */
		private setGameStatusAmount(imageStatus: core.view.ImageStatus): void {

			this._gameStatus.empty -= 1;
			this._gameStatus.placed += 1;

			if (imageStatus == core.view.ImageStatus.black) {
				this._gameStatus.black += 1;
				this.mPlayer1.text = `黑棋數量 ${this._gameStatus.black}`;
			} else if (imageStatus == core.view.ImageStatus.white) {
				this._gameStatus.white += 1;
				this.mPlayer2.text = `白棋數量 ${this._gameStatus.white}`;
			}
		}
	}
}