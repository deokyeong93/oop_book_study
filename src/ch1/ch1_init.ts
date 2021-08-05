{
  class Invitation {
    private _when: Date;
    constructor(when: Date) {
        this._when = when;
    }
  }

  class Ticket {
    private _fee: bigint;
    constructor(fee: bigint) {
      this._fee = fee;
    }

    get fee(): bigint {
      return this._fee;
    }
  }

  class Bag {
    private _amount: bigint;
    private _invitation: Invitation;
    private _ticket: Ticket;
    constructor(amount: bigint, invitation: Invitation, ticket: Ticket) {
      this._amount = amount;
      this._invitation = invitation;
      this._ticket = ticket;
    }

    plusAmount(amount: bigint): void {
      this._amount += amount;
    };

    minusAmount(amount: bigint): void {
      this._amount -= amount;
    };

    setTicket(ticket: Ticket): void {
      this._ticket = ticket;
    };

    get hasInvitation(): boolean {
      return this._invitation != null;
    }

    get hasTicket(): boolean {
      return this._ticket != null;
    }
  }

  class Audience {
    private _bag: Bag;
    constructor(bag: Bag) {
      this._bag = bag;
    }

    get bag(): Bag {
      return this._bag;
    }
  }

  class TicketOffice {
    private _amount: bigint;
    private _tickets: Array<Ticket>;

    constructor(amount: bigint, tickets:Array<Ticket> ) {
      this._amount = amount;
      this._tickets = tickets;
    }

    getTicket() {
      const result = this._tickets.shift();
      return result;
    }

    minusAmount(amount: bigint):void {
      this._amount -= amount;
    }

    plusAmount(amount: bigint):void {
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
        const ticket: Ticket = this._ticketSeller.ticketOffice.getTicket()
        audience.bag.setTicket(ticket)
      } else {
        const ticket: Ticket = this._ticketSeller.ticketOffice.getTicket();
        audience.bag.minusAmount(ticket.fee);
        this._ticketSeller.ticketOffice.plusAmount(ticket.fee);
        audience.bag.setTicket(ticket);
      }
    };
  }
}
