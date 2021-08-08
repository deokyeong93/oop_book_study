{
  class Invitation {
    constructor(private _when: Date) {}
  }

  class Ticket {
    constructor(private _fee: bigint) {}
    get fee(): bigint {
      return this._fee
    }
  }

  class Bag {
    private _amount: bigint;
    private _invitation: Invitation;
    private _ticket: Ticket;

    constructor(amount: bigint, invitation: Invitation, ticket: Ticket) {
      this._amount = amount;
      this._invitation = invitation;
      this._ticket = ticket
    }

    set ticket (ticket: Ticket) {
      this._ticket = ticket
    }

    hasInvitation = (): boolean => {
      return !!this._invitation;
    }

    hasTicket = (): boolean => {
      return !!this._ticket
    }

    minusAmount = (amount: bigint): void => {
      this._amount -= amount;
    }

    plusAmount = (amount: bigint): void => {
      this._amount += amount;
    }

    hold = (ticket: Ticket): bigint => {
      if (this.hasInvitation()) {
        this.ticket = ticket
        return BigInt(0)
      } else {
        this.ticket = ticket
        this.minusAmount(ticket.fee);
        return ticket.fee
      }
    }
  }

  class Audience {
    constructor(private _bag: Bag) {}
    
    get bag():Bag {
      return this._bag;
    }

    buy = (ticket : Ticket): bigint => this.bag.hold(ticket);
  }

  class TicketOffice {
    constructor(private _amount:bigint, private _tickets: Array<Ticket>) {}

    getTicket = (): Ticket => {
      const result = this._tickets[0];
      this._tickets.shift()
      return result;
    }

    minusAmount = (amount: bigint): bigint => this._amount - amount;
    plusAmount = (amount: bigint): bigint => this._amount + amount
  }

  class TicketSeller {
    constructor(private _ticketOffice: TicketOffice) {}

    sellTo = (audience: Audience) => {
        this._ticketOffice.plusAmount(audience.buy(this._ticketOffice.getTicket()))
    }
  }

  class Theater {
    constructor(private _ticketSeller: TicketSeller) {}

    enter = (audience: Audience): void => {
      this._ticketSeller.sellTo(audience);
    }
  }
}