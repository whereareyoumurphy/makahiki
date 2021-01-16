<template>
  <div class="profile">
    <h4><i class="fas fa-plus"></i> Add Outgoing</h4>
    <div class="create-post">
      <form @submit.prevent>
        

        <button @click="createTransaction()" class="button">create</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      newTransactionValidation: [],
      newTransaction: {
        
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

        this.$store.dispatch('createOutgoingTransaction', this.newTransaction)
        this.newTransaction = {

        }
      }
    }
  }
}
</script>