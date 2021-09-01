{
  // 도메인 개념으로 클래스를 미리 구현
  // 인스턴스 변수와
  // 객체의 메시지(퍼블릭 인터페이스)만 가시적으로 표기해 두었다.
  // 구현과 인터페이스가 우선적으로 분리되어있어 로직만 채우면 된다.

  // 개인적으로는 이 init.ts 없이 책을 보면서 따라작성해봐도 상관없다고 생각한다.

  // !주의사항!
  // 코드를 옮기다보면 BigDecimal와 같이 숫자와 관련된
  // JAVA의 클래스 타입(참조 타입), long, short ...  같은 원시 타입이 있는데
  // JS의 경우 숫자는 number밖에 없어 당혹스러울 수도 있다.
  // 정말 완벽하게 하고 싶어 JAVA에만 있는 클래스 타입을 구현해볼 수도 있겠지만
  // 이 책울 학습하고, TS로 작성하는 경험을 하는데 목적을 둔 이상 불필요한 과정이라고
  // 생각해서 JS의 기본 타입과 내장 참조 타입을 최대한 활용하였다.
  // (그러나 꼭 필요한 과정이라고 생각하면 직접 JAVA에만 있는 클래스를 구현해봐도 괜찮다고 생각한다.)
  // (작성자도 해보긴 했다..)

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

  class Customer {
    constructor(
      private _id: string,
      private _name: string,
      private _age: number
    ) {}
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

    private calculateFee() {}

    get startTime() {}

    isSequence() {}

    get movieFee() {}

    reserve() {}
  }

  class Movie {
    private _title: string;
    private _runningTime: number;
    private _fee: Money;
    private _discountPolicy: DiscountPolicy;

    constructor(
      title: string,
      runningTime: number,
      fee: Money,
      discountPolicy: DiscountPolicy
    ) {
      this._title = title;
      this._runningTime = runningTime;
      this._fee = fee;
      this._discountPolicy = discountPolicy;
    }

    get fee() {}

    calculateMovieFee() {}
  }

  class Money {
    // reform.ts 에 어울리는 클래스
    static readonly ZERO = Money.wons(0);

    constructor(private readonly _amount: number) {
      // BigDecimal는 숫자와 관련된 JAVA의 클래스 타입(참조 타입)이다
      // 또한 JAVA는 long, short ... 숫자와 관련된 타입이 많지만
      // JS는 number 타입 밖에 없고 prototype에 add같은 것이 없기 때문에
      // 따로 BigDecimal class를 구현해야 책과 같은 식의 타입 설정이 가능
      // 우선은 number로도 충분히 구현이 가능한 상황이라 따로 구현하지 않았으나
      // 하나 만들어봐도 나쁘지 않을 것 같다.
    }

    static wons() {}

    plus() {}

    minus() {}

    times() {}

    isLessThen() {}

    isGreaterThenOrEqual() {}
  }

  abstract class DiscountPolicy {
    private _conditions: Array<DiscountCondition>;

    constructor(conditions: Array<DiscountCondition>) {
      this._conditions = [...conditions];
    }

    calculateDiscountAmount() {}

    abstract getDiscountAmount();
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

    getDiscountAmount() {}
  }

  class PercentDiscountPolicy extends DiscountPolicy {
    private _percent: number;

    constructor(percent: number, conditions: Array<DiscountCondition>) {
      super(conditions);
      this._percent = percent;
    }

    getDiscountAmount() {}
  }

  class NoneDiscountPolicy extends DiscountPolicy {
    getDiscountAmount() {}
  }

  interface DiscountCondition {
    isSatisfiedBy: (screening: Screening) => boolean;
  }

  class SequenceCondition implements DiscountCondition {
    constructor(private _sequence: number) {}

    isSatisfiedBy() {}
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

    isSatisfiedBy() {}
  }
}
