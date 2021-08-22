{
  class Money {
    // Money는 전 챕터 클래스의 코드를 불러왔다..
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

  class DiscountCondition {
    constructor(
      private _type: DiscountConditionType,

      private _sequence: number,

      private _dayOfWeek: number,
      private _startTime: number,
      private _endTime: number
    ) {}

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

    setMovieType(movieType: MovieType) {
      // setter가 있긴 하지만, 그냥 함수로 하는 쪽을 더 선호한다.
      // set으로 하게 되면 변화에 취약(다양한 인수를 활용해 작성이 필요할  때 힘들어진다.)
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
  }

  class AnyClass {
    // 어떤 코드에서 사각형 정보를 불러와
    // 상태를 직접 불러내어 변화 시키는 코드를 만들면
    // 중복이 발생할 확률이 높다. => 해결방법은 캡슐화
    anyMethod(rectangle: Rectangle, multiple: number) {
      rectangle.setRight(rectangle.right * multiple);
      rectangle.setBottom(rectangle.right * multiple);
      // ...
    }
  }
}
