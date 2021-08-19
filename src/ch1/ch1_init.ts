{
  class Invitation {
    private _when: Date;
    constructor(when: Date) {
        this._when = when;
    }
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

    // Q. constructor는 amount만 들어올때랑 invitation & amount 들어올 때 둘 다 적용 필요
    constructor(amount: bigint, invitation: Invitation, ticket: Ticket) {
      this._amount = amount;
      this._invitation = invitation;
      this._ticket = ticket
    }

    // Q. 변수에 대한 값이 아닌데, get이 맞는것인가?
    hasInvitation = (): boolean => {
      // Q. null에 대한 체크는 모든 falsy한 값을 체크해야 하는가? null만 체크해야 하는가?
      return !!this._invitation;
    }

    hasTicket = (): boolean => {
      return !!this._ticket
    }

    // C. set으로 해줘야 되는 부분인데...
    // setTicket = (ticket: Ticket): void => {
    //   this._ticket = ticket
    // }
    set ticket (ticket: Ticket) {
      this._ticket = ticket
    }

    minusAmount = (amount: bigint): void => {
      this._amount -= amount;
    }

    plusAmount = (amount: bigint): void => {
      this._amount += amount;
    }
  }

  class Audience {
    constructor(private _bag: Bag) {}
    
    get bag():Bag {
      return this._bag;
    }
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

    enter = (audience: Audience): void => {
      if (audience.bag.hasInvitation()) {
        const ticket: Ticket = this._ticketSeller.ticketOffice.getTicket();
        audience.bag.ticket = ticket;
      } else {
        const ticket: Ticket = this._ticketSeller.ticketOffice.getTicket();
        audience.bag.minusAmount(ticket.fee);
        this._ticketSeller.ticketOffice.plusAmount(ticket.fee);
        audience.bag.ticket = ticket;
      }
    }
  }
}