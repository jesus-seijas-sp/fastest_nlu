# fastest_nlu

## Introduction
The idea is to have an NLU (Natural Language Understanding) of Conversational AI that is fast to train, fast to run, but with a good accuracy.

To do the comparision we use the english and spanish corpus from Amazon Massive dataset.
https://www.amazon.science/blog/amazon-releases-51-language-dataset-for-language-understanding

We will compare the speed and accuracy with RASA.

## Installation

Download this repository.
No need of ```npm install``` as there are no dependencies.

## Run

```sh
  npm start
```

## Results

For the English corpus, these are the results:
- Time for training: 3s 213.6769ms
- Accuracy: 83.66%
- Transactions per second: 181836.99495205944
 
RASA Accuracy is 81.4%, time to train in RASA is 4517 seconds, Transactions per second in RASA are 84

For the Spanish corpus, these are the results:
- Time for training: 2s 488.0854ms
- Accuracy: 81.91%
- Transactions per second: 141800.23397571384
 
RASA Accuracy is 80.4%, time to train in RASA is 4712 seconds, Transactions per second in RASA are 82
