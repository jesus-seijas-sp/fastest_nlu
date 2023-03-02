function startTimer() {
  return process.hrtime();
}

function getElapsed(hrstart) {
  const hrend = process.hrtime(hrstart);
  return hrend[0] * 1000 + hrend[1] / 1000000;
}

class Bench {
  constructor(settings = {}) {
    this.duration = settings.duration || 10000;
    this.transactionsPerRun = settings.transactionsPerRun || 1;
    this.algorithms = [];
  }

  add(name, fn, initfn) {
    const algorithm = {
      name,
      fn,
      initfn: initfn || (() => {}),
    };
    this.algorithms.push(algorithm);
    return this;
  }

  findAlgorithm(name) {
    return this.algorithms.find((algorithm) => algorithm.name === name);
  }

  measure(srcAlgorithm) {
    const algorithm =
      typeof srcAlgorithm === 'string'
        ? this.findAlgorithm(srcAlgorithm)
        : srcAlgorithm;
    const initValue = algorithm.initfn();
    const hrstart = startTimer();
    let runs = 0;
    let elapsed = 0;
    let resultIteration;
    while (elapsed < this.duration) {
      resultIteration = algorithm.fn(initValue);
      runs += 1;
      elapsed = getElapsed(hrstart);
    }
    const transactions = runs * this.transactionsPerRun;
    const timePerRun = elapsed / runs;
    const timePerTransaction = elapsed / transactions;
    const result = {
      name: algorithm.name,
      runs,
      transactions,
      elapsed,
      timePerRun,
      timePerTransaction,
      runsPerSecond: 1000 / timePerRun,
      transactionsPerSecond: 1000 / timePerTransaction,
      resultIteration,
    };
    return result;
  }

  run() {
    const result = [];
    for (let i = 0; i < this.algorithms.length; i += 1) {
      const algorithm = this.algorithms[i];
      const res = this.measure(algorithm);
      result.push(res);
    }
    return result.sort(
      (a, b) => b.transactionsPerSecond - a.transactionsPerSecond
    );
  }
}

const beginBench = (settings) => new Bench(settings);
const addAlgorithm = (bench, name, fn, initfn) => bench.add(name, fn, initfn);
const measureAlgorithm = (bench, algorithm) => bench.measure(algorithm);
const runBench = (bench) => bench.run();

module.exports = {
  startTimer,
  getElapsed,
  Bench,
  beginBench,
  addAlgorithm,
  measureAlgorithm,
  runBench,
};
