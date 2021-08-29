{
  /**
   * p163 변경과 유연성 ~ p166
   */
  // Money 객체와 Customer 객체는 2장의 코드를 그대로 가져왔습니다.
  class Customer {
    constructor(
      private _id: string,
      private _name: string,
      private _age: number
    ) {}
  }

  class Money {
    static readonly ZERO = Money.wons(0);

    constructor(private amount: number) {}

    static wons(amount: number) {
      return new Money(amount);
    }

    getAmount(): number {
      return this.amount;
    }

    plus = (amount: number): Money => {
      return new Money(this.amount + amount);
    };

    minus = (amount: number): Money => {
      return new Money(this.amount - amount);
    };

    times = (percent: number): Money => {
      return new Money(this.amount * percent);
    };

    isLessThan = (other: Money): boolean => {
      return this.amount < other.getAmount();
    };

    isGreaterThanOrEqual = (other: Money): boolean => {
      return this.amount >= other.getAmount();
    };
  }

  class Screening {
    constructor(
      private movie: Movie,
      private sequence: number,
      private whenScreened: Date
    ) {}

    getMovieFee = (): Money => {
      return this.movie.getFee();
    };

    getWhenScreened = (): Date => {
      return this.whenScreened;
    };

    getSequence = (): number => {
      return this.sequence;
    };

    private calculateFee = (audienceCount: number): Money => {
      return this.movie.calculateMovieFee(this).times(audienceCount);
    };

    reserve = (customer: Customer, audienceCount: number): Reservation => {
      return new Reservation(
        customer,
        this,
        this.calculateFee(audienceCount),
        audienceCount
      );
    };
  }

  abstract class DiscountPolicy {
    constructor(private discountConditions: Array<DiscountCondition>) {}

    calculateDiscountAmount = (screening: Screening): Money => {
      if (this.isDiscountable(screening)) {
        return this.getDiscountAmount(screening);
      }

      return Money.ZERO;
    };

    private isDiscountable = (screening: Screening): boolean => {
      return this.discountConditions.some((condition) =>
        condition.isSatisfiedBy(screening)
      );
    };

    protected abstract getDiscountAmount(screening: Screening): Money;
  }

  class AmountDiscountPolicy extends DiscountPolicy {
    constructor(
      discountConditions: Array<DiscountCondition>,
      private discountAmount: Money
    ) {
      super(discountConditions);
    }

    getDiscountAmount = (screening: Screening): Money => {
      return this.discountAmount;
    };
  }

  class PercentDiscountPolicy extends DiscountPolicy {
    constructor(
      discountConditions: Array<DiscountCondition>,
      private discountPercent: number
    ) {
      super(discountConditions);
    }

    getDiscountAmount = (screening: Screening): Money => {
      return screening.getMovieFee().times(this.discountPercent);
    };
  }

  class NoneDiscountPolicy extends DiscountPolicy {
    constructor(discountConditions: Array<DiscountCondition>) {
      super(discountConditions);
    }

    getDiscountAmount = (screening: Screening): Money => {
      return Money.ZERO;
    };
  }

  class Movie {
    constructor(
      private title: string,
      private runningTime: number,
      private fee: Money,
      //
      private discountPolicy: DiscountPolicy //
    ) {}

    calculateMovieFee = (screening: Screening): Money => {
      return this.fee.minus(
        this.discountPolicy.calculateDiscountAmount(screening).getAmount()
      );
    };

    getFee = (): Money => {
      return this.fee;
    };
  }

  interface DiscountCondition {
    isSatisfiedBy: (screening: Screening) => boolean;
  }

  class SequenceCondtion implements DiscountCondition {
    constructor(private sequence: number) {}

    isSatisfiedBy = (screening: Screening): boolean => {
      return this.sequence === screening.getSequence();
    };
  }

  class Reservation {
    //예약도 그대로 가져옴
    constructor(
      private customer: Customer,
      private screening: Screening,
      private fee: Money,
      private audienceCount: number
    ) {}
  }
}

/**
 *
 *  typeScript  추상 메서드 구현 방식
 *  abasract class CLASSNAME {
 *
 *  추상 클래스는 추상 메서드를 무조건 하나 이상 가져야한다.
 *  absstrat METHOD(value : <TYPE> ): <TYPE2>
 * }
 */

/**
 * 나머지 5장의 코드는 4장의 코드를 리팩터링 해나가는 과정과 같아 생략
 * 숙련된 개발자도 책임 할당에 어려움을 느낀다.
 * 저자는 최대한 목적에 맞는 코드를 빠르게 구현한 이후에 책임들을 올바른 위치로
 * 이동 시키는 방식으로 연습을 해나갈 것을 추천한다.
 * 단 리팩터링의 정의에 맞추어(겉보기 동작은 바뀌어서는 안 된다.)
 */
