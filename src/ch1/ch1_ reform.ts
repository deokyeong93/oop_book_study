{
  // 자율성 높이기
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

    private minusAmount(amount: bigint): void {
      this._amount -= amount;
    };

    private setTicket(ticket: Ticket): void {
      this._ticket = ticket;
    };

    private get hasInvitation(): boolean {
      return this._invitation != null;
    }

    get hasTicket(): boolean {
      return this._ticket != null;
    }

    hold(ticket: Ticket) {
      if (this.hasInvitation) {
        this.setTicket(ticket);
      } else {
        this.setTicket(ticket);
        this.minusAmount(ticket.fee);
        return ticket.fee;
      }
    };
  }

  class Audience {
    private _bag: Bag;
    constructor(bag: Bag) {
      this._bag = bag;
    }

    buy(ticket: Ticket): bigint {
      return this._bag.hold(ticket);
    };
  }

  class TicketOffice {
    private _amount: bigint;
    private _tickets: Array<Ticket>;
    constructor(amount: bigint, tickets: Array<Ticket>) {
      this._amount = amount;
      this._tickets = tickets;
    }

    getTicket() {
      const result = this._tickets.shift();
      return result;
    }

    minusAmount(amount: bigint) {
      this._amount -= amount;
    }

    plusAmount(amount: bigint) {
      this._amount += amount;
    }

    sellTicketTo(audience: Audience): void {
      this.plusAmount(audience.buy(this.getTicket()))
    }

  }

  class TicketSeller {
    private _ticketOffice: TicketOffice;
    constructor(ticketOffice: TicketOffice) {
      this._ticketOffice = ticketOffice;
    }

//    sellTo(audience: Audience):void {
//      const ticket: Ticket = this._ticketOffice.getTicket();
//      this._ticketOffice.plusAmount(audience.buy(ticket));
//    };

    sellTo(audience: Audience): void {
      this._ticketOffice.sellTicketTo(audience);
    }
  }

  class Theater {
    private _ticketSeller: TicketSeller
    constructor(ticketSeller: TicketSeller) {
      this._ticketSeller = ticketSeller;
    }

    enter(audience: Audience): void{
      this._ticketSeller.sellTo(audience);
    };
  }
}
