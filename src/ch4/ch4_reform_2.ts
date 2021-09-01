{
  class Money {
    static readonly ZERO = Money.wons(0);

    constructor(private _amount: number) {}

    static wons(amount: number) {
      return new Money(amount);
    }

    get amount(): number {
      return this._amount;
    }

    plus = (amount: number): Money => {
      return new Money(this._amount + amount);
    };

    minus = (amount: any): Money => {
      return new Money(this._amount - amount);
    };

    times = (percent: number): Money => {
      return new Money(this._amount * percent);
    };

    isLessThan = (other: Money): boolean => {
      return this._amount < other.amount;
    };

    isGreaterThanOrEqual = (other: Money): boolean => {
      return this._amount >= other.amount;
    };
  }

  class Customer {
    constructor(private _name: string, private _id: string) {}
  }

  class Screening {
    constructor(
      private _movie: Movie,
      private _sequence: number,
      private _whenScreened: Date
    ) {}

    get movie() {
      return this._movie;
    }

    setMovie(movie: Movie) {
      this._movie = movie;
    }

    get whenScreened() {
      return this._whenScreened;
    }

    setWhenScreened(whenScreened: Date) {
      this._whenScreened = whenScreened;
    }

    get sequence() {
      return this._sequence;
    }

    setSequence(sequence: number) {
      this._sequence = sequence;
    }

    calculateFee(audienceCount: number) {
      switch (this.movie.movieType) {
        case "AMOUNT_DISCOUNT":
          if (this.movie.isDiscountable(this.whenScreened, this.sequence)) {
            return this.movie
              .calculateAmountDiscountedFee()
              .times(audienceCount);
          }
          break;
        case "PERCENT_DISCOUNT":
          if (this.movie.isDiscountable(this.whenScreened, this.sequence)) {
            return this.movie
              .calculatePercentDiscountedFee()
              .times(audienceCount);
          }
          break;
        case "NONE_DISCOUNT":
          return this.movie.calculateNoneDiscountedFee().times(audienceCount);
      }
      return this.movie.calculateNoneDiscountedFee().times(audienceCount);
    }
  }

  class Reservation {
    constructor(
      private _customer: Customer,
      private _screening: Screening,
      private _fee: Money,
      private _audienceCount: number
    ) {}

    get costomer() {
      return this._customer;
    }

    setCustomer(customer: Customer) {
      this._customer = customer;
    }

    get screening() {
      return this._screening;
    }

    setScreening(screening: Screening) {
      this._screening = screening;
    }

    get fee() {
      return this._fee;
    }

    setFee(fee: Money) {
      this._fee = fee;
    }

    get audienceCount() {
      return this._audienceCount;
    }

    setAudienceCount(audienceCount: number) {
      this._audienceCount = audienceCount;
    }
  }

  const IllegalArgumentException = () => {
    return "";
  };

  class DiscountCondition {
    constructor(
      private _type: DiscountConditionType,

      private _sequence: number,

      private _dayOfWeek: number,
      private _startTime: number,
      private _endTime: number
    ) {}

    isDiscountableForWhen(dayOfWeek: number, time: number): boolean {
      if (this.type !== DiscountConditionType.PERIOD) {
        // 예외처리 함수 실행이라 new를 굳이 안 썼다.
        throw IllegalArgumentException();
      }

      return (
        this.dayOfWeek === dayOfWeek &&
        this.startTime >= time &&
        this.endTime <= time
      );
    }
    // TS로 옮기는 과정에서 dayOfWeek, time, sequence의 타입을
    // 동일하게 number로 작성하여 isDiscountable의 오버로드가
    // 안 되어 부득이 하게 함수 명을 다르게 작성
    isDiscountableForSequence(sequence: number): boolean {
      if (this.type !== DiscountConditionType.PERIOD) {
        // 예외처리 함수 실행이라 new를 굳이 안 썼다.
        throw IllegalArgumentException();
      }

      return this.sequence === sequence;
    }

    get type() {
      return this._type;
    }

    setType(type: DiscountConditionType) {
      this._type = type;
    }

    get dayOfWeek() {
      return this._dayOfWeek;
    }

    setDayOfWeek(dayOfWeek: number) {
      this._dayOfWeek = dayOfWeek;
    }

    get startTime() {
      return this._startTime;
    }

    setStartTime(startTime: number) {
      this._startTime = startTime;
    }

    get endTime() {
      return this._endTime;
    }

    setEndTime(endTime: number) {
      this._endTime = endTime;
    }

    get sequence() {
      return this._sequence;
    }

    setSequence(sequence: number) {
      this._sequence = sequence;
    }
  }

  enum DiscountConditionType {
    SEQUENCE = "SEQUENCE",
    PERIOD = "PERIOD",
  }

  enum MovieType {
    AMOUNT_DISCOUNT = "AMOUNT_DISCOUNT",
    PERCENT_DISCOUNT = "PERCENT_DISCOUNT",
    NONE_DISCOUNT = "NONE_DISCOUNT",
  }

  class Movie {
    constructor(
      private _title: string,
      private _runningTime: number,
      private _fee: Money,
      private _discountConditions: Array<DiscountCondition>,

      private _movieType: MovieType,
      private _discountAmount: Money,
      private _discountPercent: number
    ) {}

    get movieType() {
      return this._movieType;
    }

    calculateAmountDiscountedFee(): Money {
      if (this.movieType !== MovieType.AMOUNT_DISCOUNT) {
        throw IllegalArgumentException();
      }

      return this.fee.minus(this.discountAmount);
    }

    calculatePercentDiscountedFee(): Money {
      if (this.movieType !== MovieType.PERCENT_DISCOUNT) {
        throw IllegalArgumentException();
      }

      return this.fee.minus(this.fee.times(this.discountPercent));
    }

    calculateNoneDiscountedFee(): Money {
      if (this.movieType !== MovieType.NONE_DISCOUNT) {
        throw IllegalArgumentException();
      }

      return this.fee;
    }

    isDiscountable(whenScreened: Date, sequence: number) {
      for (let condition of this._discountConditions) {
        if (condition.type === DiscountConditionType.PERIOD) {
          if (
            condition.isDiscountableForWhen(
              whenScreened.getDay(),
              whenScreened.getTime()
            )
          ) {
            return true;
          }
        } else {
          if (condition.isDiscountableForSequence(sequence)) {
            return true;
          }
        }

        return false;
      }
    }

    setMovieType(movieType: MovieType) {
      this._movieType = movieType;
    }

    get fee() {
      return this._fee;
    }

    setFee(fee: Money) {
      this._fee = fee;
    }

    get discountCoditions() {
      return this._discountConditions;
    }

    setDiscountConditions(discountCounditions: Array<DiscountCondition>) {
      this._discountConditions = discountCounditions;
    }

    get discountAmount() {
      return this._discountAmount;
    }

    setDiscountAmount(discountAmount: Money) {
      this._discountAmount = discountAmount;
    }

    get discountPercent() {
      return this._discountPercent;
    }

    setDiscountPercent(discountPercent: number) {
      this._discountPercent = discountPercent;
    }
  }

  class ReservationAgency {
    reserve(
      screening: Screening,
      customer: Customer,
      audienceCount: number
    ): Reservation {
      const fee: Money = screening.calculateFee(audienceCount);

      return new Reservation(customer, screening, fee, audienceCount);
    }
  }
}

{
  // Rectangle 예시

  class Rectangle {
    constructor(
      private _left: number,
      private _top: number,
      private _right: number,
      private _bottom: number
    ) {}

    get left(): number {
      return this._left;
    }
    setLeft(left: number) {
      // set 접근자 보다 인자를 여러개 전달할 수 있는 메서드 형식을 선호
      this._left = left;
    }

    get top(): number {
      return this._top;
    }
    setTop(top: number) {
      this._top = top;
    }

    get right(): number {
      return this._right;
    }
    setRight(right: number) {
      this._right = right;
    }

    get bottom(): number {
      return this._bottom;
    }
    setBottom(bottom: number) {
      this._bottom = bottom;
    }

    enlarge(multiple: number) {
      // 책임의 이동
      // 객체 스스로 크기를 조절하도록 만들어줌
      this._right *= multiple;
      this._bottom *= multiple;
    }
  }

  class AnyClass {
    anyMethod(rectangle: Rectangle, multiple: number) {
      rectangle.setRight(rectangle.right * multiple);
      rectangle.setBottom(rectangle.right * multiple);
      // ...
    }
  }
}
