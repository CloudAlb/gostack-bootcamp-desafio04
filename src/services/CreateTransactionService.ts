import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

// DTO em forma de interface para os parâmetros de execute
interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

// observar que esse service (classe) cuida de regras de negócio
// praticamente todas as regras de negócio
// isso em execute()
// talvez seja mais eficiente ter outro service para cuidar dessas regras de negócio
// mas não era o escopo desse desafio
class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (type !== 'income' && type !== 'outcome') {
      throw Error('Invalid type of transaction.');
    }

    const actualBalance = this.transactionsRepository.getBalance();

    // se for uma operação outcome com valor maior do que o disponível na conta
    if (
      type === 'outcome' &&
      value > actualBalance.total
    ) {
      // retornar erro
      throw Error('Requested outcome exceeds available value.');
    }

    // somente crio a transação após passar pelos if's
    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
