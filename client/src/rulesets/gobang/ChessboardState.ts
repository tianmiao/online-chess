import ChessHost from '../chess_host';
import ChessPos from './ChessPos';

export default class ChessboardState {
  public size: number;

  private array: Array<Array<ChessHost | null>> = [];

  constructor(size: number) {
    this.size = size;
    this.clear();
  }

  public isEmpty(pos: ChessPos): boolean {
    return this.chessAt(pos) == null;
  }

  public chessAt(pos: ChessPos) {
    return this.array[pos.row][pos.col];
  }

  public setChess(pos: ChessPos, chess: ChessHost | null) {
    this.array[pos.row][pos.col] = chess;
  }

  public clear() {
    for (let row = 0; row < this.size; row++) {
      this.array.push(new Array(this.size));
      for (let col = 0; col < this.size; col++) {
        this.array[row][col] = null;
      }
    }
  }
}
