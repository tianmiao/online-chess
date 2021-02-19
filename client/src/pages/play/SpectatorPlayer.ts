import { onMounted } from "@vue/composition-api";
import * as GameEvents from 'src/online/play/gameplay_server_messages';
import GameState from "src/online/play/GameState";
import { toReadableText } from 'src/online/play/confirm_request';
import SpectateResponse from "src/online/spectator/APISpectateResponse";
import SpectatorLeaveRequest from "src/online/spectator/SpectatorLeaveRequest";
import User from "src/user/User";
import Player from "./Player";
import GameUser from "../../online/play/GameUser";

export default class SpectatorPlayer extends Player {
  constructor(context: Vue, spectateResponse: SpectateResponse) {
    const { room } = spectateResponse;
    super(context, room, true, spectateResponse.states);

    this.watchUser(spectateResponse.targetUserId);

    onMounted(() => {
      switch (room.gameStatus) {
        case GameState.READY:
          this.showText('你正在旁观中，请等待游戏开始');
          break;
        case GameState.PAUSE:
          this.showText('你正在旁观中，游戏暂停，请等待游戏继续');
          break;
        case GameState.PLAYING:
          this.showText('你正在旁观中', 3000);
          break;
        case GameState.END:
          this.showText('你正在旁观中，对局已经结束，请等待新对局');
          break;
        default:
          break;
      }
    });

    this.playfield.loaded.addOnce(() => {
      this.playfield.chessboard.clicked.add(() => {
        this.context.$q.notify('你正在旁观中');
      });
    });
  }

  protected onUserLeft(leftUser: GameUser) {
    super.onUserLeft(leftUser);
    // eslint-disable-next-line
    this.textOverlay.hide();
  }

  protected resultsReady(msg: GameEvents.ResultsReadyMsg) {
    super.resultsReady(msg);
    if (this.gameState.value == GameState.END) {
      this.gameState.value = GameState.READY;
      // eslint-disable-next-line
      this.textOverlay.hide();
    }
  }

  protected resultsGameOver(msg: GameEvents.GameOverMsg) {
    super.resultsGameOver(msg);
    const winner = msg.winUserId ? this.getGameUserByUserId(msg.winUserId) as GameUser : null;
    const winnerName = winner?.user.value?.nickname || '';
    this.showText(msg.winUserId == null ? '平局' : `${winnerName} 赢！`);
  }

  protected resultsConfirmRequest(msg: GameEvents.ConfirmRequestMsg) {
    super.resultsConfirmRequest(msg);
    const nickname = this.getGameUserByUserId(msg.uid)?.user.value?.nickname;
    this.showText(`${nickname as string}请求${toReadableText(msg.reqType)}`, 1000);
  }

  private watchUser(targetUserId: number) {
    const { room } = this;

    let watchingUser: User = this.api.localUser;

    if (targetUserId != null) {
      // 如果是观看用户
      watchingUser = room.gameUsers.find((u) => u.user?.id == targetUserId)?.user as User;
    } else if (room.gameUsers.length == 2) {
      watchingUser = room.gameUsers[+(Math.random() > 0.5)].user as User;
    } else {
      watchingUser = room.gameUsers[0].user as User;
    }

    this.localUser.user.value = watchingUser;
  }

  public onQuitClick() {
    this.exitScreen();
  }

  protected exitScreen() {
    const req = new SpectatorLeaveRequest(this.room);
    req.success = () => {
      super.exitScreen();
    };
    req.failure = () => {
      super.exitScreen();
    };
    this.api.perform(req);
  }
}
