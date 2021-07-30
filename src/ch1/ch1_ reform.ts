{
  // 자율성 높이기
  class Invitation {
    constructor(private _when: Date) {}
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

    private minusAmount = (amount: number): void => {
      this._amount -= amount;
    };

    private setTicket = (ticket: Ticket): void => {
      this._ticket = ticket;
    };

    hold = () => {
      if (this.hasInvitation) {
        this.setTicket(this._ticket);
        return 0;
      } else {
        this.minusAmount(this._ticket.fee);
        this.setTicket(this._ticket);
        return this._ticket.fee;
      }
    };

    private get hasInvitation(): boolean {
      return !!this._invitation;
    }

    get hasTicket(): boolean {
      return !!this._ticket;
    }
  }

  class Audience {
    constructor(private _bag: Bag) {}

    buy = (ticket: Ticket): number => {
      return this._bag.hold();
    };
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

    // sellTicketTo= (audience: Audience) => {
    // 이렇게 하면 TicketOffice에 대한 응집도, 자율성은 높아지지만
    // Audience에 대한 의존성이 추가되어 전체적인 관점에서 결합도가 높아진다.
    // 회의 결과 TicketOffice의 응집도를 낮추고
    // Tickeseller를 그대로 두어 전체적인 결합도를 낮추기로 하였다.
    //    const ticket: Ticket = this.getTicket();
    //     this.plusAmount(audience.buy(ticket))
    // }
  }

  class TicketSeller {
    constructor(private _ticketOffice: TicketOffice) {}

    // sellTo = (audience:Audience) => {
    //     this._ticketOffice.sellTicketTo(audience)
    // }

    sellTo = (audience: Audience) => {
      const ticket: Ticket = this._ticketOffice.getTicket();
      this._ticketOffice.plusAmount(audience.buy(ticket));
    };
  }

  class Theater {
    constructor(private _ticketSeller: TicketSeller) {}

    enter = (audience: Audience) => {
      this._ticketSeller.sellTo(audience);
    };
  }
}
