module core.view {

	export class SettingUI extends eui.Component implements eui.UIComponent {

		private _isCompleteLoadSkin: boolean = false;

		public mBack: eui.Button;

		public constructor() {
			super();
			this.addEventListener(eui.UIEvent.COMPLETE, this.omComplete, this);
			this.skinName = "skins.SettingUISkin";
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}

		protected childrenCreated(): void {
			super.childrenCreated();
		}

		private omComplete(): void {
			helper.logDescription("SettingUISkin omComplete load skin");
			this._isCompleteLoadSkin = true;
			this.removeEventListener(eui.UIEvent.COMPLETE, this.omComplete, this);
		}
	}
}