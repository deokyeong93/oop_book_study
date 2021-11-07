# Chapter 14 일관성 있는 협력

### 주제
- 객체는 협력을 위해 존재
- **협력**: 객체가 존재하는 이유와 문맥을 제공
- **객체지향 설계의 목표**: 적절한 책임을 수행하는 객체들의 협력을 기반으로 결합도가 낮고 재사용 가능한 코드 구조를 창조
- **설계의 재사용**: 객체들의 협력 방식을 일관성 있게 만들어야 함
  - 일관성: 설계 비용 감소 & 코드 이해가 쉬워짐

## 01. 핸드폰 과금 시스템 변경하기
### 기본 정책 확장
> "일반 요금제" + "심야 할인 요금제"에서 아래 정책으로 확장

| 유형 | 형식 | 예 |
|--|--|--|
| 고정요금 방식 | A초다 B원 | 10초당 18원 |
| 시간대별 방식 | A시부터 B시까지 C초당 D원 | 00시부터 19시까지 10초당 18원 |
|  | B시부터 C시까지 D초당 E원 | 19시부터 24시까지 10초당 15원 |
| 요일별 방식 | 평일에는 A초당 B원 | 평일에는 10초당 38원 |
|  | 공휴일에는 A초당 C원 | 공휴일에는 10초당 19원 |
| 구간별 방식 | 초기 A분 동안 B초당 C원 | 초기 1분 동안 10초당 50원 |
|  | A분 ~ D분까지 B초당 D원 | 초기 1분 동안 10초당 20원 |
|  | D분 초과 시 B초당 E원 | |

### 고정요금 방식 구현하기
- 기존 일반 요금제와 동일
  - RegularPolicy 클래스의 이름을 FixedFeePolicy로 수정

### 시간대별 방식 구현하기
- 통화 기간을 정해진 시간대별로 나눈 후 각 시간대별로 서로 다른 계산 규칙 적용
- 기간을 편하게 관리할 수 있는 DateTimeInterval 클래스 추가
  - 시작 시간(from)과 종료 시간(to)을 인스턴스 변수로 포함
  - 객체 생성을 위한 정적 메서드인 of, toMidnight, fromMidnight, during을 제공
```java
public class DateTimeInterval {
  private LocalDateTime from;
  private LocalDateTime to;

  public static DateTimeInterval of(LocalDateTime from, LocalDateTime to) { ... }
  public static DateTimeInterval toMidnight(LocalDateTime from) { ... }
  public static DateTimeInterval fromMidnight(LocalDateTime to) { ... }
  public static DateTimeInterval during(LocalDate date) { ... }
  public DateTimeInterval(LocalDateTime from, LocalDateTime to) { ... }
  public Duration duration() { ... }
}
```
- Call 클래스의 통화 시간을 저장하기 위한 from과 to를 interval이라는 인스턴스 변수로 묶기
```java
public class Call {
  private DateTimeInterval interval;
}
```
- 통화 시간을 일자와 시간 기준으로 분할해서 계산
  - 통화 기간을 일자별로 분리
  - 일자별로 분리된 기간을 다시 시간대별 규칙에 따라 분리한 후 각 기간에 대해 요금을 계산
- 객체의 책임으로 할당
  - 통화 기간을 일자 단위로 나누는 책임은 DateTimeInterval에게 할당
  - 시간대별로 분할하는 작업은 TimeOfDayDiscountPolicy라는 클래스 구현
  - 전체 통화 시간을 분할하는 작업은 TimeOfDayDiscountPolicy, Call, DateTimeInterval 사이의 협력으로 구현 (그림 14.6 참조)
    - 통화 구간을 시간대별로 나눈 후, 시간대별로 요금 계산 후 합 구하기
```java
public class TimeOfDayDiscountPolicy extends BasicRatePolicy {
  private List<LocalTime> starts = new Array<>();
  private List<LocalTime> ends = new Qrray<>();
  private List<Duration> durations = new ArrayList<>();
  private List<Money> amounts = new ArrayList<>();
}
```

### 요일별 방식 구현하기
- 요일별로 요금 규칙을 다르게 설정
- 요일의 목록, 단위 시간, 단위 요금이라는 세 가지 요소로 구성
- 요일별 방식을 DayOfWeekDiscountRule라는 클래스로 구현
```java
public class DayOfWeekDiscountRule {
  private List<DayOfWeek> dayOfWeeks = new ArrayList<>();
  private Duration duration = Duration.ZERO;
  private Money moumt = Money.ZERO;

  public DayOfWeekDiscountRule(List<DayOfWeek> dayOfWeeks, Duration duration, Money amount) { ... }
  public Money calculate(DateTimeInterval interval) { ... }
}
```

### 구간별 방식 구현하기
- 고정요금 방식, 시간대별 방식, 요일별 방식의 구현 방식이 제각각
  - 새로운 구현을 추가해야 하는 상황에서 문제
  - 기존의 구현을 이해해야 하는 상황에서 문제
- 요일별 방식처럼 규칙을 정의하는 DurationDisCountRule 클래스 구현
  - 코드 재사용을 위해 FixedFeePolicy 클래스를 상속
```java
public class DurationDiscountRule extends FixedFeePolicy {
  private Duration from;
  private Duration to;

  public DurationDiscountRule (Duration from, Duration to, Money amount, Duration secounds) { ... }
  @Override
  public Money calculate(Call call) { ... }
}
``` 
- 여러 개의 DurationDiscount을 이용해 DurationDiscountRule을 구현
```java
public class DurationDiscountPolicy extends BusicRatePolicy {
  private List<DurationDiscountRule> rules = new ArrayList<>();

  public DurationDiscountPolicy(List<DurationDiscountRule> rules) { ... }
  @Overrode
  protected Money calculateCallFee(Call call) { ... }
}
```
- 기존의 설계가 어떤 가이드도 제공하지 않기 때문에 새로운 정책을 구현해야 하는 상황에서 또 다른 방식으로 기본 정책을 구현할 가능성이 높다.

## 02. 설계에 일관성 부여하기
- 일관성 있는 설계를 만드는 가장 훌륭한 조언은 다양한 설계 경험을 익히기
- 널리 알려진 디자인 패턴을 학습하고 변경이라는 문맥 안에서 디자인 패턴을 적용

### 조건 로직 대 객체 탐색
- 조건 로직을 객체 사이의 이동으로 변경
- 일관성 있게 만들기 위한 기본 지침
  - 변하는 개념을 변하지 않는 개념으로부터 분리
  - 변하는 개념을 캡슐화

### 캡슐화 다시 살펴보기
- 데이터 은닉: 오직 외부에 공개된 메서드를 통해서만 객체의 내부에 접근할 수 있게 제한
- 캡슐화: 변하는 어떤 것이든 감추는 것
  - 객체의 퍼블릭 인터페이스와 구현을 분리
  - 서브타입 캡슐화와 객체 캡슐화를 적용하는 방법
    - 변하는 부분을 분리해서 타입 계층을 만든다
    - 변하지 않는 부분의 일부로 타입 계층을 합성한다

## 03. 일관성 있는 기본 정책 구현하기
### 변경 분리하기
- 일관성 있는 협력을 만들기 위한 첫 번째 단계는 변하는 개념과 변하지 않는 개념 분리
  - 변하지 않는 '규칙'으로부터 변하는 '적용조건'을 분리

### 변경 캡슐화하기
- 협력을 일관성 있게 만들기 위해서는 변경을 캡슐화해서 파급효과를 줄여야 한다.
  - '적용조건'은 FeeCondition의 서브타입인 TimeOfDayFeeCondition, DayOfWeekFeeCondition, DurationFeeCondition으로 구현
  - FeeRule은 추상화인 FeeCondition에 대해서만 의종하기 때문에 '적용조건'이 변하더라도 영향을 받지 않는다. (캡슐화)

### 협력 패턴 설계하기
- 전체 통화 시간을 각 '규칙'의 '적용조건'을 만족하는 구간들로 나누는 작업 필요
  - '적용조건'을 가장 잘 알고 있는 정보 전문가인 FeeCondition에 할당
  - 분리된 통화 구간에 '단위요금'을 적용해서 요금을 계산하는 두 번째 작업은 '요금기준'의 정보 전문가인 FeeRule이 담당
  - FeedRule은 feePerDuration 정보를 이용해 반환받은 기간만큼의 통화 요금을 계산한 후 반환

### 추상화 수준에서 협력 패턴 구현하기
- '적용조건'을 표현하는 추상화인 FeeCondition은 findTimeIntervals라는 오퍼레이션을 포함하는 인터페이스
```java
public interface FeeCondition {
  List<DateTimeInterval> findTimeIntervals(Call call);
}
```
- FeeRule은 '단위요금(feePerDuration)'과 '적용조건(feeCondition)'을 저장하는 인스턴스 변수와 요금을 계산하는 calculateFee 메서드로 구성
```java
public class FeeRule {
  private FeeCondition feeCondition;
  private FeePerDuration feePerDuration;

  public FeeRule(FeeCondition feeCondition, FeePerDuration feePerDuration) { ... }

  public Money calculate(Call call) { ... } 
}
```
- FeePerDuration 클래스는 '단위 시간당 요금'을 계산하는 calculate 메서드 구현
```java
public class FeePerDuration {
  private Money fee;
  private Duration duration;

  public FeePerDuration(Money fee, Duration duration) { ... }
  public Money calculate(DateTimeInterval interval) { ... }
}
```
- BasicRatePolicy가 FeeRule의 컬렉션을 이용해 전체 통화 요금을 계산하도록 수정 가능 

### 구체적인 협력 구현하기
- 시간대별 정책
  - 적용조건을 구현하는 TimeOfDayFeeCondetion의 인스턴스는 Feecondition의 인터페이스를 구현하는 서브타입
  - findTimeIntervals 메서드는 시간 구간 반환

- 요일별 정책
  - DayOfWeekFeeCondition 클래스 역시 FeeCondition 인터페이스를 구현
  - findTimeIntervals 메서드는 요일에 해당하는 기간 반환

- 구간별 정책
  - FeeCondition 인터페이스를 구현하는 DurationFeeCondition 클래스를 추가한 후 findTimeIntervals 메서드를 오버라이딩
  - **개념적 무결성**: 유사한 기능에 대해 유사한 협력 패턴을 적용하는 것

### 협력 패턴에 맞추기
- 고정요금 방식에 FeeCondition의 서브타입을 추가

### 패턴을 찾아라
- 협력을 일관성 있게 만드는 과정은 유사한 기능을 구현하기 위해 반복적으로 적용할 수 있는 협력의 구조를 찾아가는 여정
