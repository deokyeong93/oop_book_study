{
  class Event {
    private subject: string;
    private from: Date;
    private duration: any;

    constructor(subject: string, from: Date, duration: any) {
      this.subject = subject;
      this.from = from;
      this.duration = duration;
    }
    // 명령을 제거했다
    public isSatisfied(schedule: RecurringSchedule): boolean {
      if (
        this.from.getDayOfWeek() != schedule.getDayOfWeek() ||
        !this.from.toLocalTime().equals(schedule.getFrom()) ||
        !this.duration.equals(schedule.getDuration())
      ) {
        return false;
      }
      return true;
    }
    // 상태를 변경하는 메서드를 퍼블릭으로 변경하여
    // 클라이언트가 필요할 경우 해당 메서드의 호출 여부 결정이 가능해짐
    public reschedule(schedule: RecurringSchedule): void {
      this.from = LocalDateTime.of(
        this.from.toLocalDate().plusDays(daysDistance(schedule)),
        schedule.getFrom()
      );
      this.duration = schedule.getDuration();
    }

    private daysDistance(schedule: RecurringSchedule): number {
      return (
        schedule.getDayOfWeek().getValue() - this.from.getDayOfWeek().getValue()
      );
    }
  }

  class RecurringSchedule {
    private subject: string;
    private dayOfWeek: any;
    private from: Date;
    private duration: any;

    constructor(subject: string, dayOfWeek: any, from: Date, duration: any) {
      this.subject = subject;
      this.dayOfWeek = dayOfWeek;
      this.from = from;
      this.duration = duration;
    }

    public getDayOfWeek(): any {
      return this.dayOfWeek;
    }

    public getFrom(): Date {
      return this.from;
    }

    public getDuration(): any {
      return this.duration;
    }
  }
}
