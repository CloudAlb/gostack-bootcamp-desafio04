import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

// DTO em forma de interface para os parâmetros de create()
interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

  // observar que essae repository (classe) não cuida de nenhuma regra de negócio
  // apenas filtra os vetores para pegar os dados corretamente em getBalance()
class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeSum = this.transactions
      .filter(({ type }) => type === 'income')
      .reduce((incomeSum, transaction) => incomeSum + transaction.value, 0);

    const outcomeSum = this.transactions
      .filter(({ type }) => type === 'outcome')
      .reduce((outcomeSum, transaction) => outcomeSum + transaction.value, 0);

    const total = incomeSum - outcomeSum;

    return {
      income: incomeSum,
      outcome: outcomeSum,
      total: total,
    };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
