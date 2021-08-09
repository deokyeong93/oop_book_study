{
  class Screening {
    constructor(
      private _movie: string,
      private _sequence: number,
      private _whenSequence: Date
    ) {}

    getStartTime(): Date {
      return this._whenSequence;
    }

    isSequence(sequence: number): boolean {
      return this._sequence === sequence;
    }

    getMovieFee(): any {
      return this._movie.getFee();
    }
  }
}
