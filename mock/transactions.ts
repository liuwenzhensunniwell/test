import faker from 'faker'
import { Response, Request } from 'express'
import { ITransactionData } from '../src/api/types'

const transactionList: ITransactionData[] = []
const transactionCount = 20

for (let i = 0; i < transactionCount; i++) {
  transactionList.push({
    ip: faker.random.number(255) + "." + faker.random.number(255) + "." + faker.random.number(255) + "." + faker.random.number(255),
    ping: faker.random.number(400),
    status: faker.random.arrayElement(['normal', 'warn', 'danger']),
    timestamp: faker.date.past().getTime(),
    username: faker.name.findName(),
    price: parseFloat(faker.finance.amount(1000, 15000, 2))
  })
}

export const getTransactions = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
      total: transactionList.length,
      items: transactionList
    }
  })
}
