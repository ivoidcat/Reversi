module core.view {

	export class HallUI extends eui.Component implements eui.UIComponent {

		private _isCompleteLoadSkin: boolean = false;

		public mDoublePlayerBtn: eui.Button;

		public mSinglePlayerBtn: eui.Button;

		public mSettingBtn: eui.Button;

		public constructor() {
			super();
			this.addEventListener(eui.UIEvent.COMPLETE, this.omComplete, this);
			this.skinName = "skins.HallUISkin";
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		private omComplete(): void {
			helper.logDescription("HallUI omComplete load skin");
			this._isCompleteLoadSkin = true;
			this.removeEventListener(eui.UIEvent.COMPLETE, this.omComplete, this);
		}
	}
}