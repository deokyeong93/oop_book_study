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
    // 명령과 질의 (command & query)가 함께 있다.
    // 버그의 원인이 된다.
    public isSatisfied(schedule: RecurringSchedule): boolean {
      if (
        this.from.getDayOfWeek() != schedule.getDayOfWeek() ||
        !this.from.toLocalTime().equals(schedule.getFrom()) ||
        !this.duration.equals(schedule.getDuration())
      ) {
        this.reschedule(schedule);
        return false;
      }
      return true;
    }

    private reschedule(schedule: RecurringSchedule): void {
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
