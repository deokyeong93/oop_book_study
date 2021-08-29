{
  /**
   *  p151 DiscountCondition 타입분리 ~ p157 다형성 분리하기 전까지
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

  enum MovieType {
    AMOUNT_DISCOUNT = "AMOUNT_DISCOUNT",
    PERCENT_DISCOUNT = "PERCENT_DISCOUNT",
    NONE_DISCOUNT = "NONE_DISCOUNT",
  }

  class Movie {
    constructor(
      private title: string,
      private runningTime: number,
      private fee: Money,
      // private discountConditions: Array<DiscountCondition>,
      private periodConditions: Array<PeriodCondition>,
      private sequenceConditions: Array<SequenceCondtion>,
      //
      private movieType: MovieType,
      private discountAmount: Money,
      private discountPercent: number
    ) {}

    calculateMovieFee = (screening: Screening): Money => {
      if (this.isDiscountable(screening)) {
        return this.fee.minus(this.calculateDiscountAmount().getAmount());
      }

      return this.fee;
    };

    private isDiscountable = (screening: Screening): boolean => {
      // return this.discountConditions.some((condition) =>
      //   condition.isSatisfiedBy(screening)
      // );
      return (
        this.checkPeriodConditions(screening) ||
        this.checkSequenceConditons(screening)
      );
    };

    private checkPeriodConditions = (screening: Screening) => {
      return this.periodConditions.some((condition) =>
        condition.isSatisfiedBy(screening)
      );
    };

    private checkSequenceConditons = (screening: Screening) => {
      return this.sequenceConditions.some((condition) =>
        condition.isSatisfiedBy(screening)
      );
    };

    private calculateDiscountAmount = (): Money | never => {
      switch (this.movieType) {
        case "AMOUNT_DISCOUNT":
          return this.calculateAmountDiscountAmount();
        case "PERCENT_DISCOUNT":
          return this.calculatePercentDiscountAmount();
        case "NONE_DISCOUNT":
          return this.calculateNoneDiscountAmount();
      }

      throw new Error("ERROR");
    };

    private calculateAmountDiscountAmount = (): Money => {
      return this.discountAmount;
    };

    private calculatePercentDiscountAmount = (): Money => {
      return this.fee.times(this.discountPercent);
    };

    private calculateNoneDiscountAmount = (): Money => {
      return Money.ZERO;
    };
  }

  enum DiscountConditionType {
    SEQUENCE = "SEQUENCE",
    PERIOD = "PERIOD",
  }

  // class DiscountCondition {
  //   constructor(
  //     private type: DiscountConditionType,
  //     private sequence: number,
  //     private dayOfWeek: number,
  //     private startTime: number,
  //     private endTime: number
  //   ) {}

  //   isSatisfiedBy = (screening: Screening): boolean => {
  //     if (this.type === DiscountConditionType.PERIOD) {
  //       return this.isSatisfiedByPeriod(screening);
  //     }

  //     return this.isSatisfiedBySequence(screening);
  //   };

  //   private isSatisfiedByPeriod = (screening: Screening): boolean => {
  //     return (
  //       this.dayOfWeek === screening.getWhenScreened().getDay() &&
  //       this.startTime <= screening.getWhenScreened().getTime() &&
  //       this.endTime >= screening.getWhenScreened().getTime()
  //     );
  //   };

  //   private isSatisfiedBySequence = (screening: Screening): boolean => {
  //     return this.sequence === screening.getSequence();
  //   };
  // }

  class PeriodCondition {
    constructor(
      private dayOfWeek: number,
      private startTime: number,
      private endTime: number
    ) {}

    isSatisfiedBy = (screening: Screening): boolean => {
      return (
        this.dayOfWeek === screening.getWhenScreened().getDay() &&
        this.startTime <= screening.getWhenScreened().getTime() &&
        this.endTime >= screening.getWhenScreened().getTime()
      );
    };
  }

  class SequenceCondtion {
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
