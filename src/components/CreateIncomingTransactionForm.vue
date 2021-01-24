<template>
  <div class="profile">
    <h4><i class="fas fa-plus"></i> Add Incoming</h4>

    <div class="create-post">
      <form @submit.prevent>

        <label>Date <small>(required)</small></label>
        <p class="invalid" v-if="!isFieldValid('date')">{{fieldValidationMessage('date')}}</p>
        <datetime v-model="newTransaction.date"></datetime>

        <label for="categoryId">Category <small>(required)</small></label>
        <p class="invalid" v-if="!isFieldValid('categoryId')">{{fieldValidationMessage('categoryId')}}</p>
        <select id="categoryId" v-model="newTransaction.categoryId">
          <option v-for="category in sortedCategories" :key="category.id" v-bind:value="category.id" >{{category.name}}</option>
        </select>

        <label for="amount">Amount <small>(required)</small></label>
        <p class="invalid" v-if="!isFieldValid('amount')">{{fieldValidationMessage('amount')}}</p>
        <input id="amount" type="number" v-model.trim="newTransaction.amount" />

        <label for="name">Note</label>
        <p class="invalid" v-if="!isFieldValid('note')">{{fieldValidationMessage('note')}}</p>
        <input id="note" type="text" v-model.trim="newTransaction.note" />

        <button @click="createTransaction()" class="button">create</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Datetime } from 'vue-datetime'
import DatesUtilities from '@/utilities/DatesUtilities.js'

export default {
  components: {
    Datetime
  },
  data() {
    return {
      newTransactionValidation: [],
      newTransaction: {
        date: new Date().toISOString(),
        transactionType: 'incoming-transactions',
        categoryId: null,
        amount: null,
        note: null
      }
    }
  },
  computed: {
    ...mapState(['userProfile']),
    ...mapState(['incomingCategories']),

    sortedCategories() {

      let sorted = [...this.incomingCategories];
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    }

  },
  methods: {

    isFieldValid(fieldName){

      var valid = true

      this.newTransactionValidation.forEach(element => {
        if (fieldName === element.field) {
          valid = false
        }
      });

      return valid

    },

    fieldValidationMessage (fieldName) {

      var message = ''

      this.newTransactionValidation.forEach(element => {
        if (fieldName === element.field) {
          message += (element.message + '. ')
        }
      });

      return message

    },

    createTransaction() {

      // do validation first
      this.newTransactionValidation = []
      
      // let dateUtils = new DatesUtilities(); 
      let transactionDate = new Date(this.newTransaction.date);

      if (!DatesUtilities.isDate(transactionDate)) {
        this.newTransactionValidation.push({field: 'date', message: 'Date must be a valid date'})
      }

      if (this.newTransaction.categoryId === null || this.newTransaction.categoryId === '') {
        this.newTransactionValidation.push({field: 'categoryId', message: 'Category is mandatory'})
      }

      if (this.newTransaction.amount === null || isNaN(this.newTransaction.amount) || this.newTransaction.amount <= 0) {
        this.newTransactionValidation.push({field: 'amount', message: 'Amount must be greater than £0'})
      }

      if (this.newTransactionValidation.length > 0) {
        return
      } else {

        this.newTransaction.date = transactionDate;

        this.$store.dispatch('createTransaction', this.newTransaction)
        this.newTransaction = {
          date: new Date().toISOString(),
          categoryId: null,
          amount: null,
          note: null,
          transactionType: 'incoming-transactions'
        }

      }
    }
  }
}
</script>