class InternalError extends Error {
  constructor() {
    super('Ошибка на сервере');
    this.statusCode = 500;
  }
}

module.exports = InternalError;
