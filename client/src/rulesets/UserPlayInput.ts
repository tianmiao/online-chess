import GameState from "src/online/play/GameState";
import Bindable from "src/utils/bindables/Bindable";
import Signal from "src/utils/signals/Signal";
import ChessHost from "./chess_host";
import GameRule from "./GameRule";

export default abstract class UserPlayInput {
  public inputDone = new Signal();

  public onReject: () => void;

  protected gameRule: GameRule;

  protected gameState: Bindable<GameState>;

  protected localChessHost: Bindable<ChessHost | null>;

  constructor(
    gameRule: GameRule,
    gameState: Bindable<GameState>,
    localChessHost: Bindable<ChessHost | null>,
  ) {
    this.gameRule = gameRule;
    this.gameState = gameState;
    this.localChessHost = localChessHost;
  }

  public abstract enable(): void;

  public abstract disable(): void;
}