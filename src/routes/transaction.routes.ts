import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

// estrutura armazenadora dos dados
const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    const balance = transactionsRepository.getBalance();

    // montar a saída desse jeito parece ser uma regra de negócio
    // e isso seria responsabilidade de algum service
    // mas pelo retorno das funções all() e getBalance()
    // parece que aqui é o lugar mais adequado para montar a saída
    // caso contrário, essa mensagem teria que ser montada no método all()
    // mas o método all() retorna um vetor de transactions, logo não faria sentido
    return response.json({
      transactions: transactions,
      balance: balance,
    });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;

    const CreateTransaction = new CreateTransactionService(
      transactionsRepository,
    );

    const transaction = CreateTransaction.execute({ title, value, type });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
