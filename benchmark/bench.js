class Bench {
  constructor(settings = {}) {
    this.duration = settings.duration || 10000;
    this.transactionsPerRun = settings.transactionsPerRun || 1;
  }

  measure(fn, initfn) {
    const initValue = initfn();
    const hrstart = process.hrtime();
    let runs = 0;
    let elapsed = 0;
    let resultIteration;
    while (elapsed < this.duration) {
      resultIteration = fn(initValue);
      runs += 1;
      const hrend = process.hrtime(hrstart);
      elapsed = hrend[0] * 1000 + hrend[1] / 1000000;
    }
    const timePerTransaction = elapsed / (runs * this.transactionsPerRun);
    return 1000 / timePerTransaction;
  }
}

module.exports = {
  Bench,
};
