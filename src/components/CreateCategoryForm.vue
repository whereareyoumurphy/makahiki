<template>
  <div class="profile">
    <h4><i class="fas fa-plus"></i> Add a Category</h4>
    <p>Use the form below to create a new incoming or outgoing transaction category.</p>
    <div class="create-post">
      <form @submit.prevent>
        <label for="name">Name <small>(required)</small></label>
        <p class="invalid" v-if="!isFieldValid('name')">{{fieldValidationMessage('name')}}</p>
        <input id="name" type="text" v-model.trim="newCategory.name" />
        
        <label for="description">Description</label>
        <p class="invalid" v-if="!isFieldValid('description')">{{fieldValidationMessage('description')}}</p>
        <textarea id="description" v-model.trim="newCategory.description"></textarea>
        
        <label for="transactiontype">Type <small>(required)</small></label>
        <p class="invalid" v-if="!isFieldValid('transactionType')">{{fieldValidationMessage('transactionType')}}</p>
        <select id="transactiontype" v-model="newCategory.transactionType">
          <option value="incoming-categories">Incoming</option>
          <option value="outgoing-categories">Outgoing</option>
        </select>
        
        <label for="budget">Monthly Budget</label>
        <p class="invalid" v-if="!isFieldValid('budget')">{{fieldValidationMessage('budget')}}</p>
        <input id="budget" type="number" v-model.trim="newCategory.budget" />

        <button @click="createCategory()" class="button">create</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      newCategoryValidation: [],
      newCategory: {
        name: '',
        description: '',
        transactionType: 'incoming-categories',
        budget: null
      }
    }
  },
  computed: {
    ...mapState(['userProfile'])
  },
  methods: {

    isFieldValid(fieldName){

      var valid = true

      this.newCategoryValidation.forEach(element => {
        if (fieldName === element.field) {
          valid = false
        }
      });

      return valid

    },

    fieldValidationMessage (fieldName) {

      var message = ''

      this.newCategoryValidation.forEach(element => {
        if (fieldName === element.field) {
          message += (element.message + '. ')
        }
      });

      return message

    },

    createCategory() {

      // do validation first
      this.newCategoryValidation = []

      if (this.newCategory.name === '') {
        this.newCategoryValidation.push({field: 'name', message: 'Name is mandatory'})
      }

      if (this.newCategory.transactionType != 'incoming-categories' && this.newCategory.transactionType != 'outgoing-categories') {
        this.newCategoryValidation.push({field: 'transactionType', message: 'Type is mandatory'})
      }

      if (this.newCategory.budget === null || isNaN(this.newCategory.budget) || this.newCategory.budget <= 0) {
        this.newCategoryValidation.push({field: 'budget', message: 'Budget must be greater than £0'})
      }

      if (this.newCategoryValidation.length > 0) {
        return
      } else {

        this.$store.dispatch('createCategory', this.newCategory)
        this.newCategory = {
          name: '',
          description: '',
          transactionType: 'incoming-categories',
          budget: null
        }
      }
    }
  }
}
</script>