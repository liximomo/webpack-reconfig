class Ticket {
  constructor(arr) {
    this._arr = arr;
  }

  key() {
    return this._arr[0];
  }

  config() {
    return this._arr[1];
  }

  asArray() {
    return this._arr;
  }

  before() {
    return this.config.$before;
  }

  after() {
    return this.config.$after;
  }

  atEnd() {
    // only return false when set to false explicitly
    return this.config.$atEnd !== false;
  }
}

function createTicket(ticket) {
  let key;
  let config;
  if (Array.isArray(ticket)) {
    return new Ticket(ticket);
  } else if (typeof ticket === 'string' || ticket instanceof String) {
    return new Ticket([ticket, {}]);
  } else {
    throw new Error(`invalid type. Expect "string | [string, any]", get "${typeof ticket}"`);
  }
}

module.exports = createTicket;
