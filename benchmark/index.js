const { Neural } = require('../src');
const { Bench } = require('./bench');
const corpusEn = require('./corpus-massive-en.json');
const corpusEs = require('./corpus-massive-es.json');

function execFn({ net, data }) {
  let good = 0;
  data.forEach((item) => {
    const classifications = net.run(item.utterance);
    if (classifications[0].intent === item.intent) {
      good += 1;
    }
  });
  return { good, total: data.length}
}

function measureCorpus(corpus) {
  const testData = [];
  corpus.data.forEach((item) => {
    item.tests.forEach((test) => {
      testData.push({ utterance: test, intent: item.intent });
    });
  });
  const net = new Neural();
  const hrstart = process.hrtime();
  net.train(corpus);
  const hrend = process.hrtime(hrstart);
  console.info('Time for training: %ds %dms', hrend[0], hrend[1] / 1000000);
  const result = execFn({ net, data: testData });
  console.log(`Accuracy: ${(result.good * 100) / result.total}`);
  const bench = new Bench({ transactionsPerRun: testData.length });
  const benchResult = bench.measure(execFn, () => ({ net, data: testData }));
  console.log(`Transactions per second: ${benchResult}`);
}

console.log('English corpus');
measureCorpus(corpusEn);
console.log('\nSpanish corpus');
measureCorpus(corpusEs);
