{
  // 보완할 부분이 많아보임..

  class Reservation {
    private _cutomer: Customer;
    private _screening: Screening;
    private _fee: Money;
    private _audienceCount: number;

    constructor(
      customer: Customer,
      screening: Screening,
      fee: Money,
      audienceCount: number
    ) {
      this._cutomer = customer;
      this._screening = screening;
      this._fee = fee;
      this._audienceCount = audienceCount;
    }
  }

  class Customer {}

  class Screening {
    private _movie: Movie;
    private _sequence: number;
    private _whenScreened: Date;
    constructor(movie: Movie, sequence: number, whenScreened: Date) {
      this._movie = movie;
      this._sequence = sequence;
      this._whenScreened = whenScreened;
    }

    private calculateFee(audienceCount: number): Money {
      return new Money(
        this._movie.calculateMovieFee(this).amount * audienceCount
      );
      // times는 어차피 곱하는 것이라 객체 접근으로 할 필요성을 못느껴 삭제하였습니다.
    }

    getStartTime(): Date {
      return this._whenScreened;
    }

    isSequence(sequence: number): boolean {
      return this._sequence === sequence;
    }

    getMovieFee(): Money {
      return this._movie.getFee();
    }

    reserve(customer: Customer, audienceCount: number): Reservation {
      return new Reservation(
        customer,
        this,
        this.calculateFee(audienceCount),
        audienceCount
      );
    }
  }

  class Movie {
    private _title: string;
    private _runningTime: string; // Duration 클래스 구현해보기
    private _fee: Money;
    private _discountPolicy: DiscountPolicy;

    constructor(
      title: string,
      runningTime: string,
      fee: Money,
      discountPolicy: DiscountPolicy
    ) {
      this._title = title;
      this._runningTime = runningTime;
      this._fee = fee;
      this._discountPolicy = discountPolicy;
    }

    getFee(): Money {
      return this._fee;
    }

    calculateMovieFee(screening: Screening): Money {
      return this.getFee().minus(
        this._discountPolicy.calculateDiscountAmount(screening).amount
      );
    }
  }

  class Money {
    // reform.ts 에 어울리는 클래스
    static readonly ZERO = Money.wons(0);

    constructor(private readonly _amount: number) {
      // BigDecimal는 숫자와 관련된 JAVA의 클래스 타입(참조 타입)이다
      // 또한 JAVA는 long, short ... 숫자와 관련된 타입이 많지만
      // JS는 number 타입 밖에 없고 prototype에 add같은 것이 없기 때문에
      // 따로 BigDecimal class를 구현해야하므로 임의로 비슷한 로직을 직접 구현할 예정
    }

    static wons(amount: number) {
      return new Money(amount);
    }

    get amount() {
      return this._amount;
    }

    plus(amount: number): Money {
      const totalAmount = this._amount + amount;
      return new Money(totalAmount);
    }

    minus(amount: number): Money | never {
      const totalAmount = this._amount - amount;
      if (totalAmount < 0) throw new Error("금액을 더 이상 낮출 수 없습니다.");
      return new Money(totalAmount);
    }

    times(percent: number): Money {
      if (percent < 0) throw new Error("error");
      if (percent > 1) throw new Error("error");
      const totalAmount = this._amount * percent;
      return new Money(totalAmount);
    }

    isLessThen(other: Money): boolean {
      return other._amount < this._amount;
    }

    isGreaterThenOrEqual(other: Money): boolean {
      return other._amount >= this._amount;
    }
  }

  abstract class DiscountPolicy {
    private _conditions: Array<DiscountCondition>;

    constructor(conditions: Array<DiscountCondition>) {
      this._conditions = [...conditions];
    }

    calculateDiscountAmount(screening: Screening): Money {
      if (
        this._conditions?.filter((condition) =>
          condition.isSatisfiedBy(screening)
        )?.length
      ) {
        return this.getDiscountAmount(screening);
      }

      return Money.ZERO;
    }

    abstract getDiscountAmount(screening: Screening): Money;
  }

  class AmountDiscountPolicy extends DiscountPolicy {
    private _discountAmount: Money;
    constructor(
      discountAmount: Money,
      ...conditions: Array<DiscountCondition>
    ) {
      super(conditions);
      this._discountAmount = discountAmount;
    }

    getDiscountAmount(screening: Screening): Money {
      return this._discountAmount;
    }
  }

  class PercentDiscountPolicy extends DiscountPolicy {
    private _percent: number;

    constructor(percent: number, conditions: Array<DiscountCondition>) {
      super(conditions);
      this._percent = percent;
    }

    getDiscountAmount(screening: Screening): Money {
      return screening.getMovieFee().times(this._percent);
    }
  }

  class NoneDiscountPolicy extends DiscountPolicy {
    getDiscountAmount(screening: Screening): Money {
      return Money.ZERO;
    }
  }

  interface DiscountCondition {
    isSatisfiedBy: (screening: Screening) => boolean;
  }

  class SequenceCondition implements DiscountCondition {
    constructor(private _sequence: number) {}

    isSatisfiedBy(screening: Screening): boolean {
      return screening.isSequence(this._sequence);
    }
  }

  class PeriodCondition implements DiscountCondition {
    private _dayOfWeek: number;
    private _startTime: number;
    private _endTime: number;

    constructor(dayOfWeek: number, startTime: number, endTime: number) {
      this._dayOfWeek = dayOfWeek;
      this._startTime = startTime;
      this._endTime = endTime;
    }

    isSatisfiedBy(screening: Screening): boolean {
      return (
        screening.getStartTime().getDay() === this._dayOfWeek &&
        this._startTime < screening.getStartTime().getTime() &&
        screening.getStartTime().getTime() < this._endTime
      );
    }
  }

  const avatar: Movie = new Movie(
    "아바타",
    new Date().toLocaleString(),
    Money.wons(10000),
    new AmountDiscountPolicy(
      Money.wons(800),
      new SequenceCondition(1),
      new SequenceCondition(10)
    )
  );
}
