
export default class MonthStatistics {

    constructor() {}

    static MapFBTransactionObjectToModel(transaction, category) {

        // Take a firebase transaction object and return a more useable model object
        // with additional properties

        return {
            id: transaction.id,
            date: transaction.date,
            amount: transaction.amount,
            note: transaction.note,
            categoryName: category.name,
            categoryId: transaction.categoryId
        }

    }

    static MapFBCategoryObjectToModel(category) {

        // Take a firebase category object and return a more useable model object
        // with additional properties

        return {
            id: category.id,
            name: category.name,
            description: category.description,
            budget: category.budget,
            transaction_count: 0,
            transaction_total: 0,
            largest_transaction: null,
            transactions: []
        }

    }

    static BootstrapTransactionType() {

        return  {
            categories: {

            },
            transaction_count: 0,
            transaction_total: 0,
            budget_total: 0,
            balance: 0,
            outcome: 'NEUTRAL',
            largest_transaction: null,
            mode_category: null,
            max_total_category: null
        }
    }

    static BootstrapMonthOverview() {
        
        return {
            transaction_count: 0,
            balance: 0,
            outcome: 'NEUTRAL',
            budget_total: 0,
            budget_outcome: 'NEUTRAL'
        }

    }

    static AddCategoryToTransactionTypeAndOverview(overview, transactionType, category) {

        // Increment the transaction type and overall budget
        transactionType.budget_total += category.budget
        overview.budget_total += category.budget

        // Add the category to the transaction type
        transactionType.categories[category.id] = this.MapFBCategoryObjectToModel(category);

    }

    static AddTransactionToTransactionTypeAndOverview(overview, transactionType, transaction) {

        transactionType.transaction_total += transaction.amount
        transactionType.transaction_count ++
        overview.balance += transaction.amount
        overview.transaction_count ++

        let categoryId = transaction.categoryId
        let category = transactionType.categories[categoryId]
        let newTransaction = this.MapFBTransactionObjectToModel(transaction, category)
        
        category.transaction_count ++
        category.transaction_total += newTransaction.amount
        category.transactions.push(newTransaction)

        // If amount is the biggest 
        if (category.largest_transaction != null) {
            if (category.largest_transaction.amount <  newTransaction.amount) {
                category.largest_transaction = newTransaction
            }
        } else {
            category.largest_transaction = newTransaction
        }

        if (transactionType.largest_transaction != null) {
            if (transactionType.largest_transaction.amount <  newTransaction.amount) {
                transactionType.largest_transaction = newTransaction
            }
        } else {
            transactionType.largest_transaction = newTransaction
        }

    }

    static calculate(month, incomingCategories, outgoingCategories) {

        // console.log('Calculating Month', month, incomingCategories, outgoingCategories);
        
        let statistics = {
            name: month.name,
            id: month.id,
            incoming : this.BootstrapTransactionType(),
            outgoing: this.BootstrapTransactionType(),
            overall : this.BootstrapMonthOverview()

            // mode_incoming_category: null,
            // mode_outgoing_category: null,
            // maximum_incoming_category: null,        // Total
            // maximum_outgoing_category: null,        // Total
            // maximum_incoming_transaction: null,
            // maximum_outgoing_transaction: null,

            // // Transactions organised
            // incoming_by_date: [],
            // incoming_by_category: [],
            // outgoing_by_date: [],
            // outgoing_by_category: [],
        }

        // Go through the categories and set up the budgets
        incomingCategories.forEach(category => {
            this.AddCategoryToTransactionTypeAndOverview(statistics.overall, statistics.incoming, category)
        })

        outgoingCategories.forEach(category => {
            this.AddCategoryToTransactionTypeAndOverview(statistics.overall, statistics.outgoing, category)
        })

        // Calculate totals for incoming and outgoing transactions
        month.incomingTransactions.forEach(transaction => {
            this.AddTransactionToTransactionTypeAndOverview(statistics.overall, statistics.incoming, transaction)
        });

        month.outgoingTransactions.forEach(transaction => {
            this.AddTransactionToTransactionTypeAndOverview(statistics.overall, statistics.outgoing, transaction)
        });

        statistics.incoming.balance = statistics.incoming.transaction_total - statistics.incoming.budget_total 
        if (statistics.incoming.balance > 0) statistics.incoming.outcome = 'POSITIVE'
        if (statistics.incoming.balance < 0) statistics.incoming.outcome = 'NEGATIVE'

        statistics.outgoing.balance = statistics.outgoing.budget_total - statistics.outgoing.transaction_total
        if (statistics.outgoing.balance > 0) statistics.outgoing.outcome = 'POSITIVE'
        if (statistics.outgoing.balance < 0) statistics.outgoing.outcome = 'NEGATIVE'

        if (statistics.overall.balance > 0) statistics.overall.outcome = 'POSITIVE'
        if (statistics.overall.balance < 0) statistics.overall.outcome = 'NEGATIVE'
        if (statistics.overall.budget_total > 0) statistics.overall.budget_outcome = 'POSITIVE'
        if (statistics.overall.budget_total < 0) statistics.overall.budget_outcome = 'NEGATIVE'

        // biggest incoming transaction
        // biggest outgoing transaction

        // most common


        // // Calculate the overall monthly balance
        // statistics.overall_monthly_balance = statistics.incoming_transaction_total - statistics.outgoing_transaction_total

        // if (statistics.overall_monthly_balance > 0) statistics.outcome = 'POSITIVE'
        // if (statistics.overall_monthly_balance < 0) statistics.outcome = 'NEGATIVE'

        console.log(statistics)

        return statistics
    }


}