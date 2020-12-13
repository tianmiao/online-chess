export enum ConfigItem {
  username = 'username',
  password = 'password',
  token = 'token',
  loginAuto = 'loginAuto',
  theme = 'theme',
  desktopNotifyEnabled = 'desktopNotifyEnabled'
}

export default class ConfigManager {
  private store: {[key: string]: unknown} = {};

  private loaded = false;

  constructor() {
    this.initDefaults();
    this.load();
    this.loaded = true;
  }

  public load() {
    if (this.loaded) return;

    [
      'username', 'password', 'token', 'loginAuto',
      'theme', 'desktopNotifyEnabled',
    ].forEach((key) => {
      let val = localStorage.getItem(key);
      if (val == null) {
        return;
      }
      try {
        // eslint-disable-next-line
        val = JSON.parse(val);
        this.set(key, val);
      } catch (e) {
        // eslint-disable-next-line
      }
    });
  }

  public save() {
    // eslint-disable-next-line
    for (let key in this.store) {
      localStorage.setItem(key, JSON.stringify(this.store[key]));
    }
  }

  public set(key: string, value: unknown) {
    this.store[key] = value;
  }

  public get(key: string) {
    return this.store[key];
  }

  private initDefaults() {
    this.set(ConfigItem.username, '');
    this.set(ConfigItem.password, '');
    this.set(ConfigItem.token, '');
    this.set(ConfigItem.loginAuto, true);

    this.set(ConfigItem.theme, 'default');
  }
}