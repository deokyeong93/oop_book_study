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

    // get set 메서드를 사용학 되면
    // 객체의 내부 인스턴스 변수 정보를 노출시켜(객체 내부의 상태 노출..)
    // 퍼블릭 인터페이스의 일부로 만들어 캡슐화를 저해한다.
    get movieType() {
      return this._movieType;
    }
    // 사실 get을 사용한다는 것은 변수의 가시성를 private에서 public
    // 로 변경하는 것과 같다.

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

  class ReservationAgency {
    reserve(
      screening: Screening,
      customer: Customer,
      audienceCount: number
    ): Reservation {
      const movie: Movie = screening.movie;

      // 할인 가능 여부를 확인하는 for문 로직
      let discountable: boolean = false;
      for (let condition of movie.discountCoditions) {
        if (condition.type === DiscountConditionType.PERIOD) {
          // whenScreened가 Date객체라 요일을 getDay로 number로 리턴
          // condition의 요일도 number로 받기로 했으므로, 요일 number가 같은지에 관한 조건이다.
          // 책에서는 요일이 string으로 나오는데, 자바스크립트 Date객체는 요일을 number로 반환하기에 바뀐 코드
          discountable =
            screening.whenScreened.getDay() === condition.dayOfWeek &&
            screening.whenScreened.getTime() >= condition.startTime &&
            screening.whenScreened.getTime() <= condition.endTime;
        } else {
          discountable = condition.sequence === screening.sequence;
        }

        if (discountable) {
          break;
        }
      }

      // 예매요금을 계산하는 로직
      let fee: Money;
      if (discountable) {
        let discountAmount: Money = Money.ZERO;
        switch (movie.movieType) {
          case "AMOUNT_DISCOUNT":
            discountAmount = movie.discountAmount;
            break;
          case "PERCENT_DISCOUNT":
            discountAmount = movie.fee.times(movie.discountPercent);
            break;
          case "NONE_DISCOUNT":
            discountAmount = Money.ZERO;
            break;
        }
        fee = movie.fee.minus(discountAmount);
      } else {
        fee = movie.fee;
      }

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

// 객체의 변화 방식이 크게 두 번에 걸쳐 나타나기 때문에
// refrom_2.ts에 이어서 작성하겠습니다.
