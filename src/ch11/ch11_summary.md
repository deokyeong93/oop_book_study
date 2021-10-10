# Chapter 11. 합성과 유연한 설계


> 오브젝트 : 코드로 이해하는 객체지향 설계 &nbsp; / &nbsp; 조영호 저자 &nbsp; / &nbsp; 위키북스
> * 구입처 &nbsp; : &nbsp; [yes24](http://www.yes24.com/Product/Goods/74219491)
    &nbsp; / &nbsp;[교보문고](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791158391409&orderClick=LAG&Kc=)
> * 저작권을 존중하고자 노력합니다. (문제시 private 하겠습니다. )
> * 책의 내용과 다릅니다.
>
## reference
* [저자 조영호 님 github](https://github.com/eternity-oop/object)



<br>

p.346


#### ✔ `설계`는 `변경`과 관련된 것이다.
* `코드 재사용을 위해서는` 객체 합성이 클래스 상속보다 더 좋은 방법이다.
* 상속과 합성은 재사용의 대상이 다르다
    * &#8594; 상속대신 합성으로 의존성을 인터페이스로 바꿀수 있다.
    * &#8594; 클래스 간 높은 결합도를 객체간의 낮은 결합도로 대체할수 있다.


> 서브클래싱에 대한 재사용을 `화이트박스 재사용`(white-box reuse)이라고 부른다. `화이트박스`는 `가시성`때문에 나온 말이다. 상속을 받으면 부모 클래스의 내부가 자식 클래스에 공개되기 때문이다. ... <br>
> 객체의 합성은 클래스 상속의 대안이다. ... `블랙박스 재사용`(black-box reuse)이라고 하는데, 객체의 내부는 공개되지 않고 인터페이스를 통해서만 재사용되기 때문이다. <br>
>


<br>

**포워딩** : 기존 클래스의 인터페이스를 그대로 외부에 제공하면서 구현에 대한 결합없이 일부 작동 방식 변경하고 싶을 때 사용하는 기법 <br>
* **포워딩 메서드** : 동일한 메서드 호출위해 추가된 메서드

<br>

🙊 **몽키 패치**  <br>
Monkey Patch <br>
* 현재 실행중인 환경에만 영향을 미치도록 지역적 코드를 수정/확장 하는 것을 가리킨다.
    * 동적 타입 언어에서는 열린 클래스(Open Class)제공으로, 몽키 패치의 일종으로 볼 수 있다.
    * C#의 확장 메서드(Extension Method), 스칼라의 암시적 변환(implicit conversion) 등
    * `JAVA` 몽키패치를 지원 X
        * 바이트코드 직접 변환
        * AOP (Aspect-Oriented Programing)

<br>

**추상메서드** <br>
* OCP 만족 - 부모클래스에서 새로운 추상메서드 추가하여 부모클래스의 다른 메서드 안에서 호출
* 단점
    * 상속 계층에 속하는 모든 자식 클래스가 추상메서드를 `오버라이딩` 해야한다.


**훅 메서드** hook method <br>
* 추상메서드와 동일하게 자식 클래스에서 오버라이딩할 의도로 메서드 추가했지만
    * 편의를 위해 기본 구현을 제공하는 메서드

<br>

🌋 **클래스 폭발** class explosion = **조합의 폭발** combination explosion <br>
* 상속의 남용으로 하나 기능 추가위해 필요이상으로 많은 수의 클래스를 추가해야 하는 경우 의미
* 해결위해서는 `상속 포기`

<br>



#### 🔹 상속을 이용해서 기본정책 구현하기


* 😃 복습겸, 계산로직을 세세히 분리시켜보다가, 공통부분에 속하는 seconds 까지 부모클래스로 올려놨다. <br>
    * 매개변수가 많아졋고,
        * 생성자에서 super(seconds)호출, 중복코드 증가, 결합도도 높아짐 ⛔
        * ch10에서 taxRate 추가 예제와 동일한 결과가 나온 것 같다.
            * **책임을 아무리 잘 분리하더라도 인스턴스 변수의 추가는 종종 상속 계층 전반에 걸친 변경을 유발한다.** - p.343
  ``` java
    public abstract class Phone {
        private List<Call> calls = new ArrayList<>();
        private Duration seconds;
    
        public Phone(Duration seconds) {
            this.seconds = seconds;
        }
    
        public void call(Call call) {
            this.calls.add(call);
        }
    
        public Money calculateFee() {
            Money result = Money.ZERO;
            for (Call call : calls) {
                long callFee = call.durationBySec(seconds);
                result = calculateCallFee(result, call, callFee);
            }
            return result;
        }
        protected abstract Money calculateCallFee(Money result, Call call, long secondOfCall);
    }
  ```

<br>


## 03 합성관계로 변경하기
p. 368


* `설계`는 `변경과 유지보수`를 위해 존재한다.
* 설계는 `트레이드오프`의 산물이다.
    * 대부분 단순한 설계가 정답이지만 변경에 따르는 고통이 `복잡성`으로 혼란을 넘어선다면, `유연성`의 손을 들어주는것이 현명한 판단일 확률이 높다.
    * `합성`은 컴파일타임 관계를 런타임 관계로 변경함으로서 클래스폭발 문제를 해결한다.
        * ch8 컴파일타임 의존성과 런타임 의존성의 거리가 멀수록 설계가 유연해진다.
        * 컴파일타임 의존성과 런타임 의존성의 거리가 멀수록 설계의 복잡도는 상승한다.


<br>

#### 🔹 기본정책 합성하기

* 다양한 종류의 객체와 `협력`하기 위해 `합성관계`를 사용시,
    * 합성 객체의 타입을 `인터페이스`나 `추상클래스`로 선언하고
    * `의존성 주입`을 통해 런타임시 필요한 객체 설정할수 있도록 구현



> 😃  `어떻게 하면 내가 합성을 이용해 리팩토링 할 수 있을까?`가 중요할 것 같아요. 개인적으로 시도했던 방법을 적어봅니다.<br>
> * 이전 step의 Phone을 새 step패키지에 옮겨두고 위의 설명을 토대로
>   * Phone 객체의 책임을 생각하고
>   * 메시지 처리할게 무엇인지 생각해보면서 실습해보면 좋을것 같아요.
>     * 참고로, Phone 은 `통화목록` 에서 시작됐습니다. - ch10
>     - 추상클래서/메서드가 되면 좀더 눈에 잘 보여지는 것 같고, 교재 실습과정이었으니, 복습겸 다시 정리해봅니다.
>       - 사실 DiscountPolicy가 눈에 박혀서 '왜 이렇게 되는거지?' 로 시작했는데요.
>         - 눈에 박힌 '정책' 보다 고려할 점, 이런 코드와 상황에서 진행될 과정 들을 학습시켜줘서 좋았습니다.
>       - 추상클래스 Phone까지 작업을 했다면,
>         -  abstract 만큼 결합도도 강해질테고, 그 부분이 요금결제이고, 변경사항이나 추가가 많다면, 중복코드도 늘어나는게 앞서 실습했던 `클래스 폭발` 내용이었죠.
>         - Phone의 객체 책임을 다시 정리하며, 이 객체가 다른 객체에게 메시지로 요청을 보낼 부분 `요금결제`라고 생각해도 되지 않을까. 생각했습니다.
>       - 어쨌든 메서드부터 인터페이스 분리 후, 앞서 공통부분을 추상클래스로 올린 것과의 차이는 List\<Call\> 이었지만, 여기선 '요금결제'로 관련된 seconds 멤버변수부터 RatePolicy로 대체되고, 그 구현클래스는 상속관계에서 했던 부분을 동일하게 진행해봤습니다.
>         - 이 과정에서 앞서, '상속으로 기본정책 구현' 시 변수 하나(seconds) 더 추가해본게, 좋지 않다는 확신을 했네요. 합성을 통해 캡슐화, 정보전문가가와 메시지의 중요성을 다시 느꼈습니다.
>   * 교재는 방법적으로 의존성 주입, 런타임 시점 등을 보게 설명합니다.
>     * 앞 챕터에서 계속 보았던 다형성과 객체의 메시지, 인터페이스를 생각하면 동일선상에서 다양한 학습과정으로 생각됐어요.
>     * 세세하고, 다양한 접근 기회를 주고, 반복하며 계속 알려주시고, 정말 좋은 책인것 같습니다. 👍



``` java
    public abstract class Phone {
        private List<Call> calls = new ArrayList<>();
        private Duration seconds;
    
        public Phone(Duration seconds) {
            this.seconds = seconds;
        }
    
        public void call(Call call) {
            this.calls.add(call);
        }
    
        public Money calculateFee() {
            Money result = Money.ZERO;
            for (Call call : calls) {
                long callFee = call.durationBySec(seconds);
                result = calculateCallFee(result, call, callFee);
            }
            return afterCalculated(result);
        }
    
        protected Money afterCalculated(Money fee) {
            return fee;
        }
        protected abstract Money calculateCallFee(Money result, Call call, long callFee);
    }
  ```

* 합성 후

  ``` java
    public class NightlyDiscountPhone extends BasicRatePolicy {
        public static final int NIGHT_HOUR = 22;
    
        private Money nightlyAmount;
        private Money regularAmount;
        private Duration seconds;
    
        public NightlyDiscountPhone(Money nightlyAmount, Money regularAmount, Duration seconds) {
            // super(seconds);  // bad
            this.nightlyAmount = nightlyAmount;
            this.regularAmount = regularAmount;
            this.seconds = seconds;
        }
    
        @Override
        protected Money calculateCallFee(Call call) {
            long callFee = call.durationBySec(seconds);
            if (call.isNightlyHour(NIGHT_HOUR)) {
                return nightlyAmount.times(callFee);
            }
            return regularAmount.times(callFee);
        }
    }
  ```


<br>

## 04 믹스인
p. 379


* 자바 코드와 아주 유사했지만, extends와  with의 조합으로 적혀진 순서대로의 선형화와 다양한 조합이 가능해지고
  * this/super 호출의 참조값의 동적 결정 등
  * 보다 실행시점에 바인딩되고 변경되는 과정들이 있었는데요.
  * 관련 객체만이 이용되도록 제약이 있으면서 유연할 수 있는 예를 보며... `유연한 설계`의 예로 받아들였습니다.
