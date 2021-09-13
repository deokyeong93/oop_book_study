{
  // 1. 디미터 법칙을 지켜라
  // 2. 클라이언트가 이해할 수 있는 이름으로 퍼블릭 인터페이스를 제공해라

  class Invitation {
    private _when: Date;
    constructor(when: Date) {
      this._when = when;
    }
  }

  class Ticket {
    constructor(private _fee: number) {}

    get fee(): number {
      return this._fee;
    }
  }

  class Bag {
    private amount: number;
    private invitation: Invitation;
    private ticket: Ticket;
    constructor(amount: number, invitation: Invitation, ticket: Ticket) {
      this.amount = amount;
      this.invitation = invitation;
      this.ticket = ticket;
    }

    plusAmount = (amount: number): void => {
      this.amount += amount;
    };

    minusAmount = (amount: number): void => {
      this.amount -= amount;
    };

    hold = (ticket: Ticket): number => {
      if (this.hasInvitation) {
        this.ticket = ticket;
        return 0;
      } else {
        this.ticket = ticket;
        this.minusAmount(ticket.fee);
        return ticket.fee;
      }
    };

    get hasInvitation(): boolean {
      return !!this.invitation;
    }

    get hasTicket(): boolean {
      return !!this.ticket;
    }
  }

  class Audience {
    // 디미터 법칙을 준수하는 Audience
    constructor(private bag: Bag) {
      this.bag = bag;
    }

    getbag(): Bag {
      return this.bag;
    }

    buy(ticket: Ticket): number {
      return this.bag.hold(ticket);
    }
  }

  class TicketOffice {
    constructor(private _amount: number, private _tickets: Array<Ticket>) {}

    getTicket() {
      const result = this._tickets[0];
      this._tickets = this._tickets.filter(
        (ticket, index: number) => 0 !== index
      );
      return result;
    }

    minusAmount(amount: number) {
      this._amount -= amount;
    }

    plusAmount(amount: number) {
      this._amount += amount;
    }
  }

  class TicketSeller {
    // ticketoffice와 audience에만 메세지전송
    private ticketOffice: TicketOffice;
    constructor(ticketOffice: TicketOffice) {
      this.ticketOffice = ticketOffice;
    }

    getticketOffice(): TicketOffice {
      return this.ticketOffice;
    }

    sellTo(audience: Audience): void {
      this.ticketOffice.plusAmount(audience.buy(this.ticketOffice.getTicket()));
    }
  }

  class Theater {
    // 문지말고 ticketseller에게 시켜라
    private ticketSeller: TicketSeller;

    constructor(ticketSeller: TicketSeller) {
      this.ticketSeller = ticketSeller;
    }

    enter = (audience: Audience) => {
      this.ticketSeller.sellTo(audience);
    };
  }
}
