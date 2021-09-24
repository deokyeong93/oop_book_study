{
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
    private _amount: number;
    private _invitation: Invitation;
    private _ticket: Ticket;
    constructor(amount: number, invitation: Invitation, ticket: Ticket) {
      this._amount = amount;
      this._invitation = invitation;
      this._ticket = ticket;
    }

    plusAmount = (amount: number): void => {
      this._amount += amount;
    };

    minusAmount = (amount: number): void => {
      this._amount -= amount;
    };

    setTicket = (ticket: Ticket): void => {
      this._ticket = ticket;
    };

    get hasInvitation(): boolean {
      return !!this._invitation;
    }

    get hasTicket(): boolean {
      return !!this._ticket;
    }
  }

  class Audience {
    constructor(private _bag: Bag) {}

    get bag(): Bag {
      return this._bag;
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
    private _ticketOffice: TicketOffice;
    constructor(ticketOffice: TicketOffice) {
      this._ticketOffice = ticketOffice;
    }

    get ticketOffice(): TicketOffice {
      return this._ticketOffice;
    }
  }

  class Theater {
    private _ticketSeller: TicketSeller;

    constructor(ticketSeller: TicketSeller) {
      this._ticketSeller = ticketSeller;
    }

    enter = (audience: Audience) => {
      if (audience.bag.hasInvitation) {
        const ticket: Ticket = this._ticketSeller.ticketOffice.getTicket();
        audience.bag.setTicket(ticket);
      } else {
        const ticket: Ticket = this._ticketSeller.ticketOffice.getTicket();
        audience.bag.minusAmount(ticket.fee);
        this._ticketSeller.ticketOffice.plusAmount(ticket.fee);
        audience.bag.setTicket(ticket);
      }
    };
  }
}
