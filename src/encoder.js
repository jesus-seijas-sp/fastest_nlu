const normalize = (str) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const tokenize = (str) => str.split(/[\s,.!?;:([\]'"¡¿)/]+/).filter((x) => x);

class Encoder {
  constructor(processor) {
    this.processor = processor || ((str) => tokenize(normalize(str)));
    this.featureMap = new Map();
    this.numFeature = 0;
    this.intentMap = new Map();
    this.intents = [];
  }

  learnIntent(intent) {
    if (!this.intentMap.has(intent)) {
      this.intentMap.set(intent, this.intents.length);
      this.intents.push(intent);
    }
  }

  learnFeature(feature) {
    if (!this.featureMap.has(feature)) {
      this.featureMap.set(feature, this.numFeature);
      this.numFeature += 1;
    }
  }

  encodeText(text, learn = false) {
    const dict = {};
    const keys = [];
    const features = this.processor(text);
    features.forEach((feature) => {
      if (learn) {
        this.learnFeature(feature);
      }
      const index = this.featureMap.get(feature);
      if (index !== undefined && dict[index] === undefined) {
        dict[index] = 1;
        keys.push(index);
      }
    });
    return keys;
  }

  encode(text, intent, learn = false) {
    if (learn) {
      this.learnIntent(intent);
    }
    return {
      input: this.encodeText(text, learn),
      output: this.intentMap.get(intent),
    };
  }

  encodeCorpus(corpus) {
    const result = { train: [], validation: [] };
    corpus.forEach(({ utterances, intent }) => {
      if (utterances) {
        utterances.forEach((utterance) => {
          result.train.push(this.encode(utterance, intent, true));
        });
      }
    });
    corpus.forEach(({ tests, intent }) => {
      if (tests) {
        tests.forEach((test) => {
          result.validation.push(this.encode(test, intent));
        });
      }
    });
    return result;
  }
}

module.exports = { normalize, tokenize, Encoder };
