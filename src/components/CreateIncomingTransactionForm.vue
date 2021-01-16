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
          
        </select>

        <label for="amount">Amount <small>(required)</small></label>
        <p class="invalid" v-if="!isFieldValid('amount')">{{fieldValidationMessage('amount')}}</p>
        <input id="amount" type="number" v-model.trim="newTransaction.amount" />

        <label for="name">Note <small>(required)</small></label>
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

export default {
  components: {
    Datetime
  },
  data() {
    return {
      newTransactionValidation: [],
      newTransaction: {
        date: new Date().toISOString(),
        categoryId: null,
        amount: null,
        note: null
      }
    }
  },
  computed: {
    ...mapState(['userProfile'])
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
      
      if (this.newTransactionValidation.length > 0) {
        return
      } else {

        this.$store.dispatch('createIncomingTransaction', this.newTransaction)
        this.newTransaction = {

        }
      }
    }
  }
}
</script>