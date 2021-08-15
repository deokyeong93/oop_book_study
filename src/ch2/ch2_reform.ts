{
  class Reservation {
    private _customer: Customer;
    private _screening: Screening;
    private _fee: Money;
    private _audienceCount: number;

    constructor(customer: Customer, screening: Screening, fee: Money, audienceCount: number) {
      this._customer = customer;
      this._screening = screening;
      this._fee = fee;
      this._audienceCount = audienceCount;
    }
  }

  class Screening {
    private _movie: Movie;
    private _sequence: number;
    private _whenScreened: Date;

    constructor(movie: Movie, sequence: number, whenScreened: Date) {
      this._movie = movie;
      this._sequence = sequence;
      this._whenScreened = whenScreened;
    }

    get startTime():Date {
      return this._whenScreened;
    }

    isSequence(sequence: number):Boolean {
      return this._sequence === sequence
    }

    get movieFee():Money {
      return this._movie.Fee
    }

    private calculateFee(audienceCount: number): Money {
      return this._movie.calculateMovieFee(this).times(audienceCount);
    }

    reserve(customer: Customer, audienceCount: number):Reservation {
      return new Reservation(customer, this, this.calculateFee(audienceCount), audienceCount);
    }
  }

  class Movie {
    private _title: string;
    private _runningTime: number;
    private _fee: Money;
    private _discountPolicy: DiscountPolicy;

    constructor(title: string, runningTime: number, fee: Money, discountPolicy: DiscountPolicy) {
      this._title = title;
      this._runningTime = runningTime;
      this._fee = fee;
      this._discountPolicy = discountPolicy;
    }

    get Fee():Money {
      return this._fee
    }
    
    calculateMovieFee = (screening: Screening) => {
      if (!this._discountPolicy) {
        return this.Fee;
      }

      return this._fee.minus(this._discountPolicy.calculateDiscountAmount(screening));
    }

    set discountPolicy (discountPolicy: DiscountPolicy) {
      this._discountPolicy = discountPolicy;
    }
  }

  interface DiscountPolicy {
    calculateDiscountAmount(screening: Screening): Money;
  }

  abstract class DefaultDiscountPolicy implements DiscountPolicy {
    private _conditions: Array<DiscountCondition>;

    constructor(conditions: Array<DiscountCondition>) {
      this._conditions = [...conditions];
    }

    calculateDiscountAmount(screening: Screening): Money {
      let conditions = [];
      this._conditions
        .filter(condition => condition.isSatisfiedBy(screening))
        .forEach(condition => conditions.push(condition))

      if (conditions.length) {
        return this.getDiscountAmount(screening)
      } else {
        return Money.ZERO;
      }
    }

    abstract getDiscountAmount(sereening: Screening): Money
  }

  class AmountDiscountPolicy extends DefaultDiscountPolicy {
    private _discountAmount: Money;
    
    constructor (discountAmount: Money, conditions: Array<DiscountCondition>) {
      super(conditions);
      this._discountAmount = discountAmount;
    }
    
    getDiscountAmount(screening: Screening):Money {
      return this._discountAmount;
    }
  }

  class PercentDiscountPolicy extends DefaultDiscountPolicy {
    private _percent: number;

    constructor(percent: number, conditions: Array<DiscountCondition>) {
      super(conditions);
      this._percent = percent;
    }

    getDiscountAmount(screening: Screening):Money {
      return screening.movieFee.times(this._percent);
    }
  }

  class NoneDiscountPolicy implements DiscountPolicy {
    calculateDiscountAmount(screening: Screening): Money {
      return Money.ZERO;
    }
  }

  interface DiscountCondition {
    isSatisfiedBy(screening: Screening): Boolean;
  }

  class SequenceCondition implements DiscountCondition {
    constructor(private _sequence: number) {}

    sequenceConfition(sequence: number) {
      this._sequence = sequence;
    }

    isSatisfiedBy(screening: Screening):Boolean {
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

    isSatisfiedBy(screening: Screening):Boolean {
      const { startTime } = screening;
      return (startTime.getDay() === this._dayOfWeek) && (this._startTime <= startTime.getTime()) && (this._endTime >= startTime.getTime())
    }
  }

  class Money {
    static readonly ZERO = Money.wons(BigInt(0));
    
    constructor(private _amount: bigint) {}

    static wons(amount: bigint) {
      return new Money(amount)
    }

    get amount():bigint {
      return this._amount;
    }

    plus = (amount: bigint): Money => {
      return new Money(this._amount + amount);
    }

    minus = (amount: any): Money => {
      return new Money(this._amount - amount)
    }

    times = (percent: number): Money => {
      return new Money(this._amount * BigInt(percent))
    }

    isLessThan = (other: Money): boolean => {
      return this._amount < other.amount
    }

    isGreaterThanOrEqual = (other: Money): boolean => {
      return this._amount >= other.amount
    }
  }

  class Customer {
    constructor(
      private _id: string,
      private _name: string,
      private _age: number
    ) {}
  }

}